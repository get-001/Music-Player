const get = params => {
  return axios.get("http://a-1.vip/Music-Player/api.php", {
    params: {
      ...params
    }
  });
};

const lyricProcess = (lyricText, songsName) => {
  const lyricArr = [];
  lyricArr.push({ time: 0, content: songsName });
  const reg = /(\[[\d]{2,3}:[\d]{2,3}\.[\d]{2,3}\])(.+)/g;
  lyricText.replace(reg, ($, time, content) => {
    const reg = /\[([\d]{2,3}):([\d]{2,3})\.([\d]{2,3})\]/;
    time.replace(reg, ($, $1, $2, $3) => {
      time = Number($1 * 60 * 1000) + Number($2 * 1000) + Number($3);
    });
    lyricArr.push({ time, content });
  });
  return lyricArr;
};

const ajaxSong = {
  detailed: (item, callBack) => {
    const songs = {
      // 全局
      url: "",
      lyric: "",
      lyricList: [],
      picUrl: item.al.picUrl + "?param=500y500",
      // 局部
      // 需要的属性：'al','name','id','ar','publishTime'
      name: item.name,
      id: item.id,
      singer: item.ar[0].name,
      album: item.al.name,
      // --- 不一定有 publishTime
      publishTime: item.publishTime
    };
    get({ id: item.id, types: "url", source: "netease" })
      .then(({ data }) => {
        songs["url"] = data.url;
        return get({
          id: item.id,
          types: "lyric",
          source: "netease"
        });
      })
      .then(({ data }) => {
        songs["lyric"] = data.lyric;
        songs["lyricList"] = lyricProcess(
          data.lyric,
          songs.singer + " - " + songs.name
        );
        callBack(songs);
      });
  }
};

const getCacheIndex = () => {
    let arr = localStorage["list"];
    if (!arr) return [];
    arr = JSON.parse(arr);
    return arr.constructor === Array ? arr : [];
  },
  getCache = key => {
    // 容错
    let data = localStorage[key];
    if (!data) return null;
    data = JSON.parse(data);
    return data.constructor === Object ? data : null;
  },
  addCache = (key, data) => {
    let list = getCacheIndex();
    let isPush = list.some(ele => ele === key);
    isPush || list.push(key);
    localStorage["list"] = JSON.stringify(list);
    localStorage[key] = JSON.stringify(data);
  },
  delCache = key => {
    let list = getCacheIndex();
    list.forEach((ele, index) => {
      if (ele === key) list.splice(index, 1);
    });
    localStorage["list"] = JSON.stringify(list);
    localStorage.removeItem(key);
  };
const filterObj = (data, arr, mapArr) => {
  let map = false;
  if (mapArr && mapArr.constructor === Array) {
    map = true;
    if (arr.length !== mapArr.length) return;
  }
  const isArr = data.constructor === Array;
  data = isArr ? data : [data];
  data = data.map(ele => {
    const obj = {};
    arr.forEach((key, index) => {
      if (map) {
        obj[mapArr[index]] = ele[key];
      } else {
        obj[key] = ele[key];
      }
    });
    return obj;
  });
  if (isArr) {
    return data;
  } else {
    return data[0];
  }
};

// 判断浏览器类型
const myBrowser = () => {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  if (userAgent.indexOf("OPR") > -1) {
    return "Opera";
  } //判断是否Opera浏览器 OPR/43.0.2442.991
  if (userAgent.indexOf("Firefox") > -1) {
    return "FF";
  } //判断是否Firefox浏览器  Firefox/51.0
  if (userAgent.indexOf("Trident") > -1) {
    return "IE";
  } //判断是否IE浏览器  Trident/7.0; rv:11.0
  if (userAgent.indexOf("Edge") > -1) {
    return "Edge";
  } //判断是否Edge浏览器  Edge/14.14393
  if (userAgent.indexOf("Chrome") > -1) {
    return "Chrome";
  } // Chrome/56.0.2924.87
  if (userAgent.indexOf("Safari") > -1) {
    return "Safari";
  } //判断是否Safari浏览器 AppleWebKit/534.57.2 Version/5.1.7 Safari/534.57.2
};

export {
  get,
  addCache,
  delCache,
  getCache,
  getCacheIndex,
  ajaxSong,
  filterObj,
  myBrowser,
  lyricProcess
};
