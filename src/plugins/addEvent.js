import Vue from "vue";

class VueTouch {
  /**
   * @param el 绑定的DOM
   * @param binding 自定义指令中的binding对象
   * @param type 绑定的事件类型
   */
  constructor(el, binding, type) {
    let g = this;

    g.obj = el;
    g.binding = binding;
    g.touchType = type;

    g.firstTouchPosition = { x: 0, y: 0 };
    g.firstTouchTime = 0;

    /**
     * =========================================
     * 事件绑定有两种方式
     * @example
     *  1. v-tap="showDialog" 绑定一个方法对象
     *  2. v-tap="{fn:click123, param1:1, param2:2, param3:{aaa:'123'} ...}"
     *      绑定一个JSON字面量，fn是执行的方法，后边的是需要传递的参数
     * 事件回调参数
     * @param 第一个参数是event，事件对象
     * @param 第二个参数是 binding.value，也就是v-tap=""双引号中的部分（如示例2，第二个参数就是 {fn:click123, param1:1, param2:2, param3:{aaa:'123'} ...}）
     * =========================================
     */

    g.callBack =
      typeof binding.value === "object" ? binding.value.fn : binding.value;

    // 事件监听回调集合
    let _listener = Object.create(null);

    // 事件方法
    let _listen = type => {
      return function(e) {
        /**
         * 取出修饰符（和v-on的一样）
         */
        let { stop, prevent, self, once } = g.binding.modifiers;

        // 配置判断
        if (stop) e.stopPropagation();
        if (prevent) e.preventDefault();
        if (once) g.obj.removeEventListener("touch" + type, _listener[type]);
        if (self && e.target !== e.currentTarget) return;

        g[type](e);
      };
    };

    _listener.start = _listen("start");
    _listener.end = _listen("end");
    _listener.move = _listen("move");

    // 事件绑定
    this.obj.addEventListener("touchstart", _listener.start, false);
    this.obj.addEventListener("touchend", _listener.end, false);
    this.obj.addEventListener("touchmove", _listener.move, false);
  }

  // 点击开始
  start(e) {
    let g = this;

    // @update 2018.3.26 这里做了一个修改
    g.moved = false; //是否移动了
    g.leaved = false; //是否离开了
    g.longTouched = false; //是否执行了长按操作

    // 获取开始点击位置和时间
    g.firstTouchPosition = g.getMultiCenter(e.changedTouches);
    g.firstTouchTime = e.timeStamp;

    // 判断长按操作 @TODO 稍微有点触发时机上的问题，待修正
    g.time = setTimeout(
      function() {
        if (!g.leaved && !g.moved) {
          g.touchType === "longtap" && g.callBack(e, g.binding.value);
          g.longTouched = true;
        }
      }.bind(g),
      1000
    );
  }

  // 点击结束
  end(e) {
    let g = this;

    // 点击结束获取点击位置并计算位移和时差
    let { x, y } = g.getMultiCenter(e.changedTouches);
    let _disX = x - g.firstTouchPosition.x;
    let _disY = y - g.firstTouchPosition.y;
    let _dis = Math.sqrt(_disX * _disX + _disY * _disY);
    let _timeDis = e.timeStamp - g.firstTouchTime;

    clearTimeout(g.time);

    // 计算滑动角度
    let _angle = this.getAngle(_disX, _disY);

    // 判断滑动方向
    if (_dis > 18 && _timeDis < 300) {
      g.touchType === "swipe" && g.callBack(e, g.binding.value);
      if (_angle >= 60 && _angle <= 120)
        g.touchType === "swipedown" && g.callBack(e, g.binding.value);
      if (_angle <= -60 && _angle >= -120)
        g.touchType === "swipeup" && g.callBack(e, g.binding.value);
      if (_angle <= 20 && _angle >= -20)
        g.touchType === "swipeleft" && g.callBack(e, g.binding.value);
      if ((_angle <= -160 && _angle > -180) || (_angle >= 160 && _angle <= 180))
        g.touchType === "swiperight" && g.callBack(e, g.binding.value);
    } else {
      if (!g.longTouched && !g.moved) {
        g.touchType === "tap" && g.callBack(e, g.binding.value);
        g.leaved = true;
      }
    }
  }

  move() {
    this.moved = true;
  }

  /**
   * 获取点击集合的中心坐标
   * @param touches touch对象集合
   * @return {{x: number, y: number}}
   */
  getMultiCenter(touches) {
    let g = this,
      x = 0,
      y = 0;

    const _length = touches.length;

    for (let i = 0; i < _length; i++) {
      x += touches[i].pageX;
      y += touches[i].pageY;
    }

    return {
      x: Math.round(x / _length),
      y: Math.round(y / _length)
    };
  }

  /**
   * 获取滑动的角度
   * @param disX X轴的位移
   * @param disY Y轴的位移
   * @return 角度
   */
  getAngle(disX, disY) {
    let g = this;

    if (typeof disX !== "number" || typeof disY !== "number") return 45;

    return (Math.atan2(disY, disX) * 180) / Math.PI;
  }
}

// ---------- 然后执行生成指令

Vue.directive("tap", {
  bind: function(el, binding) {
    new VueTouch(el, binding, "tap");
  }
});
Vue.directive("swipe", {
  bind: function(el, binding) {
    new VueTouch(el, binding, "swipe");
  }
});
Vue.directive("swipeleft", {
  bind: function(el, binding) {
    new VueTouch(el, binding, "swipeleft");
  }
});
Vue.directive("swiperight", {
  bind: function(el, binding) {
    new VueTouch(el, binding, "swiperight");
  }
});
Vue.directive("swipedown", {
  bind: function(el, binding) {
    new VueTouch(el, binding, "swipedown");
  }
});
Vue.directive("swipeup", {
  bind: function(el, binding) {
    new VueTouch(el, binding, "swipeup");
  }
});
Vue.directive("longtap", {
  bind: function(el, binding) {
    new VueTouch(el, binding, "longtap");
  }
});
