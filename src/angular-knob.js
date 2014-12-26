angular.module('wnf.directives', []).directive('jqKnob', ['$timeout', '$q', function ($timeout, $q) {
  'use strict';

  return {
    restrict: 'EA',
    replace: true,
    template: '<div class="progres-knob"><input value="{{knobData}}"/></div>',
    scope: {
      knobData: '=',
      knobOptions: '&'
    },
    link: function ($scope, $element) {
      var knobInit = $scope.knobOptions() || {},
          watchId,
          oldVal = 0,
          $input = $element.children().eq(0),
          animation = typeof knobInit.animation !== 'boolean' ? true : knobInit.animation,
          holdRelease = false;

      knobInit.release = release;

      //console.log(knobInit);

      function release(newValue) {
        if (!holdRelease) {
          $timeout(function () {
            oldVal = newValue;
            $scope.knobData = newValue;
            $scope.$apply();
          });
        }
      }

      //console.log('start');
      function bindWatch() {
        //console.log('bindWatch');
        watchId = $scope.$watch('knobData', watchKnobData);
      }

      function watchKnobData(newValue, oldValue) {
        if (newValue !== oldValue && newValue !== oldVal) {
          //console.log('watchKnobData');
          //console.log(newValue, oldValue);
          watchId();
          animate(newValue).then(bindWatch);
        }
      }

      function animate(val) {
        var deferred = $q.defer();

        console.log('animate', val, oldVal);
        console.log(animation);

        if (animation) {
          holdRelease = true;

          $({value: oldVal}).animate({value: val}, {
            duration: 800,
            easing: 'linear',
            progress: function () {
              $input.val(Math.round(this.value)).trigger('change');
            },
            complete: function () {
              //console.log('complete');
              holdRelease = false;
              oldVal = val;
              deferred.resolve();
            }
          });
        } else {
          $input.val(val).trigger('change');
          deferred.resolve();
        }

        return deferred.promise;
      }

      function processOptions() {
        if (knobInit.after) {
          $input.after(knobInit.after);
        }
      }

      function init() {
        processOptions();

        $input.val(0).knob(knobInit);

        animate($scope.knobData).then(bindWatch);
      }

      init();
    }
  };
}]);

