import React from 'react';
import { Image } from "native-base";

var imgPath = [
  require('../images/restuarants/0.jpeg'),
  require('../images/restuarants/1.jpeg'),
  require('../images/restuarants/2.jpeg'),
  require('../images/restuarants/3.jpeg'),
  require('../images/restuarants/4.jpeg'),
  require('../images/restuarants/5.jpeg'),
  require('../images/restuarants/6.jpeg'),
  require('../images/restuarants/7.jpeg'),
  require('../images/restuarants/8.jpeg'),
  require('../images/restuarants/9.jpeg'),
  require('../images/restuarants/10.jpeg'),
  require('../images/restuarants/11.jpeg'),
  require('../images/restuarants/12.jpeg'),
  require('../images/restuarants/13.jpeg'),
  require('../images/restuarants/14.jpeg'),
  require('../images/restuarants/15.jpeg'),
  require('../images/restuarants/16.jpeg'),
  require('../images/restuarants/17.jpeg'),
  require('../images/restuarants/18.jpeg'),
  require('../images/restuarants/19.jpeg'),
  require('../images/restuarants/20.jpeg'),
  require('../images/restuarants/21.jpeg'),
  require('../images/restuarants/22.jpeg'),
  require('../images/restuarants/23.jpeg'),
  require('../images/restuarants/24.jpeg'),
  require('../images/restuarants/25.jpeg'),
  require('../images/restuarants/26.jpeg'),
  require('../images/restuarants/27.png'),
  require('../images/restuarants/28.jpeg'),
  require('../images/restuarants/29.jpeg'),
  require('../images/restuarants/30.jpeg'),
  require('../images/restuarants/31.jpeg'),
  require('../images/restuarants/32.jpeg'),
  require('../images/restuarants/33.jpeg'),
  require('../images/restuarants/34.jpeg'),
  require('../images/restuarants/35.jpeg'),
  require('../images/restuarants/36.jpeg'),
  require('../images/restuarants/37.jpeg'),
  require('../images/restuarants/38.jpeg'),
  require('../images/restuarants/39.jpeg'),
  require('../images/restuarants/40.jpeg'),
  require('../images/restuarants/41.jpeg'),
  require('../images/restuarants/42.jpeg'),
  require('../images/restuarants/43.jpeg'),
  require('../images/restuarants/44.png'),
  require('../images/restuarants/45.jpeg'),
  require('../images/restuarants/46.jpeg'),
  require('../images/restuarants/47.jpeg'),
  require('../images/restuarants/48.jpeg'),
  require('../images/restuarants/49.png'),
  require('../images/restuarants/50.jpeg'),
  require('../images/restuarants/51.jpeg'),
  require('../images/restuarants/52.jpeg'),
  require('../images/restuarants/53.png'),
  require('../images/restuarants/54.jpeg'),
  require('../images/restuarants/55.jpeg'),
  require('../images/restuarants/56.jpeg'),
  require('../images/restuarants/57.jpeg'),
  require('../images/restuarants/58.jpeg'),
  require('../images/restuarants/59.jpeg'),
  require('../images/restuarants/60.png'),
  require('../images/restuarants/61.jpeg'),
  require('../images/restuarants/62.jpeg'),
  require('../images/restuarants/63.jpeg'),
  require('../images/restuarants/64.jpeg'),
  require('../images/restuarants/65.jpeg'),
  require('../images/restuarants/66.jpeg'),
  require('../images/restuarants/67.jpeg'),
  require('../images/restuarants/68.jpeg'),
  require('../images/restuarants/69.jpeg'),
  require('../images/restuarants/70.jpeg'),
  require('../images/restuarants/71.jpeg'),
  require('../images/restuarants/72.jpeg'),
  require('../images/restuarants/73.jpeg'),
  require('../images/restuarants/74.jpeg'),
  require('../images/restuarants/75.jpeg'),
  require('../images/restuarants/76.jpeg'),
  require('../images/restuarants/77.jpeg'),
  require('../images/restuarants/78.jpeg'),
  require('../images/restuarants/79.jpeg'),
  require('../images/restuarants/80.jpeg'),
  require('../images/restuarants/81.jpeg'),
  require('../images/restuarants/82.jpeg'),
  require('../images/restuarants/83.jpeg'),
  require('../images/restuarants/84.png'),
  require('../images/restuarants/85.jpeg'),
  require('../images/restuarants/86.jpeg'),
  require('../images/restuarants/87.jpeg'),
  require('../images/restuarants/88.jpeg'),
  require('../images/restuarants/89.png'),
  require('../images/restuarants/90.jpeg'),
  require('../images/restuarants/91.jpeg'),
  require('../images/restuarants/92.jpeg'),
  require('../images/restuarants/93.jpeg'),
  require('../images/restuarants/94.jpeg'),
  require('../images/restuarants/95.jpeg'),
  require('../images/restuarants/96.jpeg'),
  require('../images/restuarants/97.jpeg'),
  require('../images/restuarants/98.jpeg'),
  require('../images/restuarants/99.jpeg'),
  require('../images/restuarants/100.jpeg'),
  require('../images/restuarants/101.jpeg'),
  require('../images/restuarants/102.png'),
  require('../images/restuarants/103.jpeg'),
  require('../images/restuarants/104.jpeg'),
  require('../images/restuarants/105.jpeg'),
  require('../images/restuarants/106.jpeg'),
  require('../images/restuarants/107.jpeg'),
  require('../images/restuarants/108.png'),
  require('../images/restuarants/109.jpeg'),
  require('../images/restuarants/110.jpeg'),
  require('../images/restuarants/111.jpeg'),
  require('../images/restuarants/112.jpeg'),
  require('../images/restuarants/113.jpeg'),
]

function RestImg(props) {
  const item = props.item;
  if (item.id <= 113)
    img_source = imgPath[item.id]
  else if (item.category == "??????")
    img_source = require('../images/food/1.png')
  else if (item.category == "??????")
    img_source = require('../images/food/2.png')
  else if (item.category == "????????? / ??? / ??????")
    img_source = require('../images/food/3.png')
  else if (item.category == "??????")
    img_source = require('../images/food/4.png')
  else if (item.category == "??????")
    img_source = require('../images/food/5.png')
  else if (item.category == "?????? / ??????")
    img_source = require('../images/food/6.png')
  else if (item.category == "?????? / ??????")
    img_source = require('../images/food/7.png')
  else if (item.category == "??????")
    img_source = require('../images/food/8.png')
  else if (item.category == "??????")
    img_source = require('../images/food/9.png')
  else if (item.category == "?????????")
    img_source = require('../images/food/10.png')
  else if (item.category == "?????? / ?????????")
    img_source = require('../images/food/11.png')
  else
    img_source = require('../images/food/none.png')
  return <Image
    style={{ flex: 3 }}
    resizeMode="contain"
    source={img_source}
    alt="Alternate Text"
    size="md"
    borderRadius={1}
    m={1}
  />
}

export default RestImg;