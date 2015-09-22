(function(_global){
  cube_func = {}
  cube_func.turncube = function(cube,side){
    console.log(cube)
    cube.removeClass(function(index,css){
      return (css.match (/(^|\s)show-\S+/g) || []).join(' ');
    })
    cube.addClass(side);
  }
  window["cube_func"] = cube_func
})(window)