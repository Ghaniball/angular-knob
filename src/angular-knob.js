angular.module('ui.knob', []).directive('knob', ['$timeout', '$q', function ($timeout, $q) {
  'use strict';

  return {
    restrict: 'EA',
    replace: true,
    template: '<div class="progres-knob"><input value="{{knobData}}"/></div>',
    scope: {
      knobData: '=',
      knobOptions: '&'
    },
    link: function ($scope, element) {
      var knobInit = $scope.knobOptions() || {},
          watchId,
          oldVal = 0,
          $input = $(element).children('input'),
          holdRelease = false;


      knobInit.release = release;

      function release(newValue) {
        //var deferred = $q.defer();

        if (holdRelease) {
          //deferred.resolve();
        } else {
          $timeout(function () {
            oldVal = newValue;
            $scope.knobData = newValue;
            $scope.$apply();
            //deferred.resolve();
          });
        }

        //return deferred.promise;
      }

      console.log('start');
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
        console.log('animate', val, oldVal);
        //$(element).val(newValue).change();
        holdRelease = true;
        var deferred = $q.defer();

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

