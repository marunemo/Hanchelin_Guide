import React from 'react';
import { Image } from "native-base";

var imgPath = [
  {
    "restImg": require('../images/restuarants/0.jpeg'),
    // "restImg": require('../images/food/4.png')
  },
  {
    "restImg": require('../images/restuarants/1.jpeg'),
    // "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/2.jpeg'),
    // "restImg": require('../images/food/7.png')
  },
  {
    "restImg": require('../images/restuarants/3.jpeg'),
    // "restImg": require('../images/food/3.png')
  },
  {
    // "restImg": require('../images/restuarants/4.jpeg'),
    "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/5.jpeg'),
    // "restImg": require('../images/food/6.png')
  },
  {
    "restImg": require('../images/restuarants/6.jpeg'),
    // "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/7.jpeg'),
    // "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/8.jpeg'),
    // "restImg": require('../images/food/4.png')
  },
  {
    "restImg": require('../images/restuarants/9.jpeg'),
    // "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/10.jpeg'),
    // "restImg": require('../images/food/4.png')
  },
  {
    "restImg": require('../images/restuarants/11.jpeg'),
    // "restImg": require('../images/food/3.png')
  },
  {
    "restImg": require('../images/restuarants/12.png'),
    // "restImg": require('../im/ages/food/3.png')
  },
  {
    "restImg": require('../images/restuarants/13.jpeg'),
    // "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/14.jpeg'),
    // "restImg": require('../images/food/2.png')
  },
  {
    "restImg": require('../images/restuarants/15.jpeg'),
    // "restImg": require('../images/food/6.png')
  },
  {
    "restImg": require('../images/restuarants/16.jpeg'),
    // "restImg": require('../images/food/11.png')
  },
  {
    "restImg": require('../images/restuarants/17.jpeg'),
    // "restImg": require('../images/food/6.png')
  },
  {
    "restImg": require('../images/restuarants/18.jpeg'),
    // "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/19.jpeg'),
    // "restImg": require('../images/food/4.png')
  },
  {
    "restImg": require('../images/restuarants/20.jpeg'),
    // "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/21.jpeg'),
    // "restImg": require('../images/food/6.png')
  },
  {
    "restImg": require('../images/restuarants/22.jpeg'),
    // "restImg": require('../images/food/4.png')
  },
  {
    "restImg": require('../images/restuarants/23.jpeg'),
    // "restImg": require('../images/food/6.png')
  },
  {
    "restImg": require('../images/restuarants/24.jpeg'),
    // "restImg": require('../images/food/2.png')
  },
  {
    "restImg": require('../images/restuarants/25.jpeg'),
    // "restImg": require('../images/food/3.png')
  },
  {
    "restImg": require('../images/restuarants/26.jpeg'),
    // "restImg": require('../images/food/2.png')
  },
  {
    "restImg": require('../images/restuarants/27.png'),
    // "restImg": require('../images/food/3.png')
  },
  {
    "restImg": require('../images/restuarants/28.jpeg'),
    // "restImg": require('../images/food/4.png')
  },
  {
    "restImg": require('../images/restuarants/29.jpeg'),
    // "restImg": require('../images/food/3.png')
  },
  {
    "restImg": require('../images/restuarants/30.jpeg'),
    // "restImg": require('../images/food/10.png')
  },
  {
    "restImg": require('../images/restuarants/31.jpeg'),
    // "restImg": require('../images/food/6.png')
  },
  {
    "restImg": require('../images/restuarants/32.jpeg'),
    // "restImg": require('../images/food/6.png')
  },
  {
    "restImg": require('../images/restuarants/33.jpeg'),
    // "restImg": require('../images/food/3.png')
  },
  {
    "restImg": require('../images/restuarants/34.jpeg'),
    // "restImg": require('../images/food/3.png')
  },
  {
    "restImg": require('../images/restuarants/35.jpeg'),
    // "restImg": require('../images/food/3.png')
  },
  {
    // "restImg": require('../images/restuarants/36.jpeg'),
    "restImg": require('../images/food/2.png')
  },
  {
    "restImg": require('../images/restuarants/37.jpeg'),
    // "restImg": require('../images/food/4.png')
  },
  {
    "restImg": require('../images/restuarants/38.jpeg'),
    // "restImg": require('../images/food/5.png')
  },
  {
    "restImg": require('../images/restuarants/39.jpeg'),
    // "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/40.jpeg'),
    // "restImg": require('../images/food/3.png')
  },
  {
    "restImg": require('../images/restuarants/41.jpeg'),
    // "restImg": require('../images/food/6.png')
  },
  {
    "restImg": require('../images/restuarants/42.jpeg'),
    // "restImg": require('../images/food/2.png')
  },
  {
    "restImg": require('../images/restuarants/43.jpeg'),
    // "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/44.png'),
    // "restImg": require('../images/food/3.png')
  },
  {
    "restImg": require('../images/restuarants/45.jpeg'),
    // "restImg": require('../images/food/2.png')
  },
  {
    "restImg": require('../images/restuarants/46.jpeg'),
    // "restImg": require('../images/food/3.png')
  },
  {
    "restImg": require('../images/restuarants/47.jpeg'),
    // "restImg": require('../images/food/3.png')
  },
  {
    "restImg": require('../images/restuarants/48.jpeg'),
    // "restImg": require('../images/food/3.png')
  },
  {
    "restImg": require('../images/restuarants/49.png'),
    // "restImg": require('../images/food/10.png')
  },
  {
    "restImg": require('../images/restuarants/50.jpeg'),
    // "restImg": require('../images/food/2.png')
  },
  {
    "restImg": require('../images/restuarants/51.jpeg'),
    // "restImg": require('../images/food/5.png')
  },
  {
    "restImg": require('../images/restuarants/52.jpeg'),
    // "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/53.png'),
    // "restImg": require('../images/food/3.png')
  },
  {
    "restImg": require('../images/restuarants/54.jpeg'),
    // "restImg": require('../images/food/3.png')
  },
  {
    "restImg": require('../images/restuarants/55.jpeg'),
    // "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/56.jpeg'),
    // "restImg": require('../images/food/4.png')
  },
  {
    "restImg": require('../images/restuarants/57.jpeg'),
    // "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/58.jpeg'),
    // "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/59.jpeg'),
    // "restImg": require('../images/food/6.png')
  },
  {
    "restImg": require('../images/restuarants/60.png'),
    // "restImg": require('../images/food/11.png')
  },
  {
    "restImg": require('../images/restuarants/61.jpeg'),
    // "restImg": require('../images/food/3.png')
  },
  {
    "restImg": require('../images/restuarants/62.jpeg'),
    // "restImg": require('../images/food/3.png')
  },
  {
    "restImg": require('../images/restuarants/63.jpeg'),
    // "restImg": require('../images/food/3.png')
  },
  {
    "restImg": require('../images/restuarants/64.jpeg'),
    // "restImg": require('../images/food/1.png')
  },
  {
    // "restImg": require('../images/restuarants/65.jpeg'),
    "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/66.jpeg'),
    // "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/67.jpeg'),
    // "restImg": require('../images/food/6.png')
  },
  {
    "restImg": require('../images/restuarants/68.jpeg'),
    // "restImg": require('../images/food/2.png')
  },
  {
    "restImg": require('../images/restuarants/69.jpeg'),
    // "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/70.jpeg'),
    // "restImg": require('../images/food/8.png')
  },
  {
    "restImg": require('../images/restuarants/71.jpeg'),
    // "restImg": require('../images/food/7.png')
  },
  {
    "restImg": require('../images/restuarants/72.jpeg'),
    // "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/73.jpeg'),
    // "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/74.jpeg'),
    // "restImg": require('../images/food/5.png')
  },
  {
    "restImg": require('../images/restuarants/75.jpeg'),
    // "restImg": require('../images/food/6.png')
  },
  {
    "restImg": require('../images/restuarants/76.jpeg'),
    // "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/77.jpeg'),
    // "restImg": require('../images/food/6.png')
  },
  {
    "restImg": require('../images/restuarants/78.jpeg'),
    // "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/79.jpeg'),
    // "restImg": require('../images/food/4.png')
  },
  {
    "restImg": require('../images/restuarants/80.jpeg'),
    // "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/81.jpeg'),
    // "restImg": require('../images/food/5.png')
  },
  {
    "restImg": require('../images/restuarants/82.jpeg'),
    // "restImg": require('../images/food/8.png')
  },
  {
    "restImg": require('../images/restuarants/83.jpeg'),
    // "restImg": require('../images/food/11.png')
  },
  {
    "restImg": require('../images/restuarants/84.png'),
    // "restImg": require('../images/food/3.png')
  },
  {
    "restImg": require('../images/restuarants/85.jpeg'),
    // "restImg": require('../images/food/2.png')
  },
  {
    "restImg": require('../images/restuarants/86.jpeg'),
    // "restImg": require('../images/food/3.png')
  },
  {
    "restImg": require('../images/restuarants/87.jpeg'),
    // "restImg": require('../images/food/1.png')
  },
  {
    "restImg": require('../images/restuarants/88.jpeg'),
    // "restImg": require('../images/food/8.png')
  },
  {
    "restImg": require('../images/restuarants/89.png'),
    // "restImg": require('../images/food/6.png')
  },
  {
    "restImg": require('../images/restuarants/90.jpeg'),
    // "restImg": require('../images/food/3.png')
  },
  {
    // "restImg": require('../images/restuarants/91.jpeg'),
    "restImg": require('../images/food/9.png')
  },
  {
    // "restImg": require('../images/restuarants/92.jpeg'),
    "restImg": require('../images/food/2.png')
  },
  {
    // "restImg": require('../images/restuarants/93.jpeg'),
    "restImg": require('../images/food/7.png')
  },
  {
    // "restImg": require('../images/restuarants/94.jpeg'),
    "restImg": require('../images/food/4.png')
  },
  {
    // "restImg": require('../images/restuarants/95.jpeg'),
    "restImg": require('../images/food/10.png')
  },
  {
    // "restImg": require('../images/restuarants/96.jpeg'),
    "restImg": require('../images/food/9.png')
  },
  {
    // "restImg": require('../images/restuarants/97.jpeg'),
    "restImg": require('../images/food/4.png')
  },
  {
    // "restImg": require('../images/restuarants/98.jpeg'),
    "restImg": require('../images/food/3.png')
  },
  {
    // "restImg": require('../images/restuarants/99.jpeg'),
    "restImg": require('../images/food/1.png')
  },
  {
    // "restImg": require('../images/restuarants/100.jpeg'),
    "restImg": require('../images/food/1.png')
  },
  {
    // "restImg": require('../images/restuarants/101.jpeg'),
    "restImg": require('../images/food/6.png')
  },
  {
    // "restImg": require('../images/restuarants/102.jpeg'),
    "restImg": require('../images/food/6.png')
  },
  {
    // "restImg": require('../images/restuarants/103.jpeg'),
    "restImg": require('../images/food/1.png')
  },
  {
    // "restImg": require('../images/restuarants/104.jpeg'),
    "restImg": require('../images/food/6.png')
  },
  {
    // "restImg": require('../images/restuarants/105.jpeg'),
    "restImg": require('../images/food/1.png')
  },
  {
    // "restImg": require('../images/restuarants/106.jpeg'),
    "restImg": require('../images/food/6.png')
  },
  {
    // "restImg": require('../images/restuarants/107.jpeg'),
    "restImg": require('../images/food/6.png')
  },
  {
    // "restImg": require('../images/restuarants/108.jpeg'),
    "restImg": require('../images/food/5.png')
  },
  {
    // "restImg": require('../images/restuarants/109.jpeg'),
    "restImg": require('../images/food/4.png')
  },
  {
    // "restImg": require('../images/restuarants/110.jpeg'),
    "restImg": require('../images/food/1.png')
  },
  {
    // "restImg": require('../images/restuarants/111.jpeg'),
    "restImg": require('../images/food/8.png')
  },
  {
    // "restImg": require('../images/restuarants/112.jpeg'),
    "restImg": require('../images/food/3.png')
  },
  {
    // "restImg": require('../images/restuarants/113.jpeg'),
    "restImg": require('../images/food/4.png')
  },
  {
    // "restImg": require('../images/restuarants/114.jpeg'),
    "restImg": require('../images/food/1.png')
  },
  {
    // "restImg": require('../images/restuarants/115.jpeg'),
    "restImg": require('../images/food/1.png')
  },
  {
    // "restImg": require('../images/restuarants/116.jpeg'),
    "restImg": require('../images/food/1.png')
  },
  {
    // "restImg": require('../images/restuarants/117.jpeg'),
    "restImg": require('../images/food/6.png')
  }
]

function RestImg(props) {
  const item = props.item;
  img_source = imgPath[item.id]["restImg"]
  return <Image
    style={{ flex: 3 }}
    resizeMode="contain"
    source={img_source}
    alt="Alternate Text"
    size="md"
    borderRadius={1}
  />
}

export default RestImg;