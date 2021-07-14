/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,Alert,
  View, Image, TouchableOpacity, FlatList, Dimensions,Button,TouchableHighlight
} from 'react-native';

const listTab = [
  {
    status: '모두'
  },
  {
    status: '배달o'
  },
  {
    status: '배달x'
  }
]


const data = [
  {
    name: '한식당',
    status: '배달o',
    image: 'https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg',
    like: 5,
    star: 93,
    review: 34,
    operation: 1
},
  {
    name: '한국식당',
    status: '배달x',
    image: 'https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg'
    ,like: 0,
    star: 3,
    review: 23,
    operation: 0
},
  {
    name: '한동식당',
    status: '배달x',
    image: 'data:image/png;base64,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'
    ,like: 5,
    star: 133,
    review: 1,
    operation: 1
    },
  {
    name: '중식당',
    status: '배달o',
    image: 'data:image/jpeg;base64,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'
    ,like: 1,
    star: 3,
    review: 34,
    operation: 1
    },
  {
    name: '중국식당',
    status: '배달x',
    image: 'https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg'
    ,like: 4 ,
    star: 63,
    review: 12,
    operation: 0 
  },
  {
    name: '매모식당',
    status: '배달x',
    image: 'https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg'
    ,like: 6,
    star: 33,
    review: 6,
    operation: 1
  },
  {
    name: '파파식당',
    status: '배달x',
    image: 'https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg'
    ,like: 2,
    star: 3,
    review: 3,
    operation: 0
  },
  {
    name: '미모식당',
    status: '배달x',
    image: 'https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg'
    ,like: 8,
    star: 13,
    review: 6,
    operation: 1
  },
  {
    name: '중마라식당',
    status: '배달x',
    image: 'https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg'
    ,like: 3,
    star: 5,
    review: 1,
    operation: 0
  },
  {
    name: '한동kk식당',
    status: '배달o',
    image: 'data:image/png;base64,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'
    ,like: 15,
    star: 2,
    review: 0,
    operation: 1
  },
  {
    name: '한동dd식당',
    status: '배달x',
    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALoAAAEPCAMAAADCoC6xAAABs1BMVEX///89MzH/5Mf/+nrrMxtVgbL/5Mj/rpH/5sj/79H/6Mo9MzI9MzD/7M7/7dD/48U4LSv//4F8XDYvIyE4Li329fUzKCb//4UoGhfyNBv//33s6urm5OSYlJM1MC4uJCTS0M9GPTsnGBVdVlQnHB314MVjVUxnYV/AvLzd29ogEAtXT05yZVnQvqiKhIPGtaC3s7Pey7SmoqGpmYj++O94c3FbU1JPR0WjIAf3wbmQi4tNPTBFNzCqpqXXNyOIMifkJQBjTDXWOCR5MSf/+NpdUEaPgHIAAAB9cWX969j9vqT91LijlINxamjt6n5pYjlPdaU2TmthQz9FIx15FwCTIApdGRCcIQ5WBgBAKiblYE/yoZj82dPjQS6zLBfoc2ZHBgBjEADmUkHvkYdTIxv0sqmAEwCjMyRqMSmuLRg/HRdwVTf/6ebqfW95JxuVMydfNC8lMS/OxbrEnoz8uJ3ctqAtIxN+eUhGPUfIxGpdVUPq49c+NCByaziVkVS8uGbg3X1PRyUkEx0kIzBSa4xDRkuDf1AsMkJeXkhAX4hATVxzclCRkFxfYFBJXHYxQltNVGKTEwJoAAAX1ElEQVR4nO1djZ/SVroGBmkSSMgYkoEBhgATviEEZLDzQXUURAdQq7U77dZtd60f195bd6+9rt7tON1Wu9pt7Z98zzkJ5JOPQYF4fzy/dsZJDslz3jznfd/zFRyOJZZYYoklllhiiSWWWGKJJZZYYoklllhiiSWWGAJ20QSmQySaTKaTye3soomcGLU0D23O8qV8ZtFcToRwXOXLbucjC6RyQrBxHdlI/f0xfJc3HKjtLYLGFMiUTIdq5QXwmAJ1C6eY5udOYwpULC0cD8+bxxTIWx7NpudMYwrw29bHa/xcaUyDbd76eMT+Zu8OE3Xa9mrvDku6yrZ37kOtHu7OlccUiA6N+lvzpDENskONO1RKtsFQL1izfe5uyBtVlPi58pgG4SHcS7a3OrB73dIP1mzv2CGidYsczPYeRgZbMbkT+/v1odh7T7obFsjb3q0PA2/u9r0vyL8X/sUKleiiGUwLPrloBtMiHH9f2+jQtMb2YOv8oilMiUj8Pci7LFGu28wtsnx5LzNGwSxAuDZkXEa9Tnncdd4p2O0bN8+e/eTWFm95OsJXtmvJOMcwHEOnu7VSNJO1dDHyde4Nu84MEHF+6g6dOxdy7//BGGnYTDTtCyYAadrp9HqdPidNcxwTTHD1Utmo+XAcXsd9LmS+zozAHu6Hzn324edud8h9U3vPSCXNBBnA2Qo0xyTipQyrv4773IeOP35huM7skL4dCjXOOByfn3O73X/omzIbrQ+l3UeAC3LdAfvubcD8Tw54oZD7y3m4If6rkDv0Z/CPDwH10L48lpjJ55jAaN4yvHSQ2UbtMvsVqHnoM/Cvv5wbXGe22AbGgs/5zJ+g1d13gO8rx4Nj7K1jzwRrEeU67nN/+eZreBn3rTnkCskGvNO5z75AzEN3+T1nMODVMIONcxRz8D+X60bSjRC60Ln+dWZP/WNkJHcoJP+6t8Hoie3sWpD1er36Yxy369YidPZdz/OxfLRW2hvEQzYcdiT1t/xoQ8/p4enTOxrVowfgDeye3zE0BS/d0F3nEx5evA9027dquRXQqIBbTsiuq5y8c+vWI+c9d0hzy/s66t7d06chd9XIXm/At3MeHjTYfeO29jL7j3bvfHXrUB72i+QT6LZvEaq6CeU2wTRMo+42oEwa395vDG4aahjapw9SP31+NwDYAwQg74fyMYPZNz5SqYfu3b8Nrh1qPPgSJA48Q8uthU5Mq6KaquJgNPwfIICAGHouFLp9Q33WRr14dxDP0w/Pn9/Z2Tmv0D5tYXUvvd/nHvr2AniSsOWD4FRjOdUcuensXk5o7xSHzD/75pv/BE74wZ2BtTYMhJyBndNWeLhjbKjejUfK0ws9uA9dzdeOM5+BA/8V1zzIgHMqn5nvX8IH73MPevM/OhxnYCD66B5QDvjvW4PNEaXdhybiQEDGKoKLbjzaD0G4HyGzOOQo1zjUFgtOM/IUCWovcYh8MKD+DXTDjRsP9hu3v3204bTw4d7Ajpb8w/M7voDR5DI2Ni7A63wEVY8C9NfQLjp7cNOM95W11DcuoCcrCwbg0V83AIYFH+hUgM7PQ737AiaD68gD/PUBiquff/PhF8jZ6ETom0IxUW2oQXpxo2aKfl+wUIqePXAuspcZGVoRuY19bVx1u3WfYE7WEWGz2YijYkF94MzGUneOMLURG7rgZKQeBmwm7SPyNTqRSAS2VD/s0zlhCBCIxlpzcura4GQUjDPPJBLBunnU20ooOc4JH7gu1mw80jFvHJ7AqOOpf6ujfk//RGkvSpUD49OC7ZzFxX3e2IPQ8Ku/JbyHOsXc4awKBYLjuGdylvbk+DtuTfQ/PImUx0OfE6R1DmIAetzoX92qz+DNlR3lr/rcQ437Uxl9lI+8F+pf/IGTZeuWdg+OXmXAJ/TFUUW4HMwcy1+iDCnkfnA4mrk1Rd/IZr1xQQ6sjZsvwnCoD/W6AvqEjR49XFzWP6tAjUsEaWUCOtu9dffs2Y9gCB3hXuop6z4q3R7Vd/Vu+C7cO/vJV7QyMrCXZ4KJelL/kdHRyUA9mAFOVf1AmC+XNwYmt6QfaBcClmdiVUsVaMjXMmVeZRIGoSWpU6+XHkl9T0+dMQ2PVJjRDTRWLVhbd7No6vg5deLympJE1tgpHBmZeF3OZabOaqvmjVswlIYIZlMaUqcRN9OfD9RHMXeEjYIxPhVt1eJmll4fNZR6NWZ6YD5tYW/QaFW91rnaSOqOmk6RjPEZ5rXdgILZjoHUxWHUi9KmiTrX0VbH5P10hhrbY8pqSwcrxrNa3xmrmlnGqsOpkz4T9Zi4qzlm9n6aDpOXGZu5Z3KD4gHTpXTZ5KYUNxOU8KHUcfNDiokt7VMOGhNcXr0fszU+AeOdg6vRcYPWdeLbFcyRlxZGUO+YxB6ripta6obeXEllnqhN1OXoDijRen2FtZ6RawmmXCPQJIdTJ3U0ra5B6xtiTRUvM9moRlhjTNqJDrGRMKx0RtsQNkXJTKVNWshCKU6aywcKuM7b0+j+EVk3GU0Oy022xECXuOUycNSLCwa5Eqs742WkoolKTCSGUyfIuGnko3mxrVVdIuvgQQoQjMM1bmndmYn6ebrwy5XCci7kZeLhmtY1xqlqzMRPwshWDARGeQRA+YH+2CzCWhmdzC6uu0iQ30NeIsAltnXRzxxhLBHXXTw+cFD0Vl1rsPbF6mYgQAdojuNisdjm5ibDcYKLqAYZBs4lAfjgD5pj0AHJQ3Zym5sxBPAZGva7fYRORYH0wEUwWzonwBj9tBVYbliWortWrIpXd5uFQhug1elUxaIkCYLL5fIIliA8LkyQimK12ul0WvBT7UKq3iQE3YPQDXxpMZnY9VYfAi8QAEFSFI5wESdJAsMwFwT6jcFfCuAxl3yKIEmKxAcgSYwal9rImMjqhlRzGDjB1YfH05FIwjUeHkSflDrgs37lGNka+pS1mEzr1l1DAwJxEvP074+JhZSEEzI1DVP1b6xPncClQlP0qEVJc2M3w+c0pWaWCE9EvUBpSMqESFib4QAaIsliKlXEtU+IMLtYE2+glwmXjmUSyid83NCOHNci9bwoobVTFUbpBiOFarMtUYSufpg5UA0A52EhAx838Xq9DMMFvF6aS5Syw55ArKqn7vIPmAFhYCbefgwXWvGOQBlPYYI5oZRB17IgpATg5EZy8jHTcClO0/VS1sEOabJeEByN7DwuqIeCZYsFimo3QTw118lF1a1v4WS2QSBPx2mv1TLbEWBZuV2Uhph9U9IR9CikZNFThidCUCKQOEUoFdSfBDHW2uxy6seGp50L1gzn0Jon4GWEvgGRcsmOhMl/AN10dkUdPaK42wJC8sv+qF+0D5g5qFA9ZW4iTz4KIIWRYwZT16QwXp+gvb+HbImyTiBnUtCfdAkCPEwQMFyBTEZ5YIqH1HlHrqRM2dO50WuAJkPFGQRwlljNSEegrvhGyAfIROi0ikUBxMqOgMleXO9GYCFRJHGQChTrkqx55ckQ2jQ+yPJJkDkmmHe0uofNZjJww7EmXQ80KUULIkEQYiERjHs3c7utYopSRGT08BgmFcQCk4vF46AcCGBkx2OmDge4IuBu73q9mGZAMpDCZULCriBym9toK3WknL7UFIZ4dj8u5mIlVC6cSV8qCGKBVGqvUqetNx++PTQZNOjeKI1M9OX2VB8Q6eYk0pI61bmkLVdLxCnF6pqYNGFnaAqoI9gD6lQBLR0NV0rpUgU+5solycrueDUHh/b5Ut5Zr8FUqnxJlDWnDaeTJVnTQE3M6LZ8X7yFNvVGc0GO5oI52G3fO7QIPEQxB+oVTuc4GnaB4jyoxaUiKVPXzOfPbD2POiKpUCeKl6Cl00HkjWkmCHfzlow5AtTVDiAbVoZJaIbLleHQLPKhmDRwjvTstqKwg2yMayPBUDswRndls3HpSjoIhzQtqAuwXF5mziUrXQ6Gyjwo6NFSNw8svzsMglIAUcckr2OwDIKGC8+SCRADL/tN1C+Dc1H5mdGwdl2OZh38LqW3epCfHfVBUOKgYEA/eU/1O8hkUYZjHWeM1P3+y2o3AHmRPQaOZ9ZhSqChzs1w6dpguBRRd5EFIO2KbEwvFCqbD8DVN6YOh/+MuuYgAGfi0nQAuPA9mH6q1OmZLhgE7tEnCwZSh8ZUu7JcfhuoGY6Ce4xm95zRDH/T9WiS83mhNxH8Wg8zZoruLYHcYyAWkJspNKZm6iHAgUQNWtModr8H1nrQ86fRMqMELxfUUJ/pcvFs0BnYTHUKMdQ1hdRNPVmgB1M7JUAVjVk5DD8y9U0uBmfTZ6sXIA9ut4iDDLCA+2Xq2aCButdMHQqLNc6fwRHpy7DnJzGtTpsJOKdeozYhMpck0g98S6EvmIiROm2k7vFA32gaVOtbnRBbFylcqHPx2TJ38E05FrUHgjFQ93Fhs2BgczYMLngRdSgmEYYwQsjNen9hRQ6VZFvoN1NTx1tmpLE6+A98cstQEA47I6tXq3AQAe/MmnqpiHIrsoXyD51zVPSSt3KO8JOG2WoYf1AXqyoSQIKYNGZu8e2py31i0DfuUzKM84FgaYimHvnxZPQrJ9BSOtg9JapFWAOMmPVmt6iEBufIqlwF6GL0a39AXmXOYVDsiuuGdKFbR3UkO0U0HkbMqofUR0bWupBCgkGUulolgOTqjJG40irg3NCgraKunDzyK7VhfwkTZr1vgK1TLr+LTPW7QtDHcJoFbqAvZJE4ynVMcyp12GdShEUiF0NW33rcZRyiVRzcpp+SI0rqVFsgl4FGtxjvRc7Ixw1qCMNPvzXjwF1h1O7sdzwkRRxvUlpKjgzDwDBPB328hXtRGisox8odPDoYAOX6T8fvworVi0KTnzlz4GSa7X6n2iUnhQ62UmeCzFZZSQa1jHWScWS6+Xg8jRYtqrrChJ32nHZHshl1cN3vdwklNKfJQj5nBL9fQ1rbv/YLZ9RLZLZV5h7QQue2xTCCki95rovwYGK8XtrLZPjM9t+IAWv0W4Lzdir7y9EKKJWpdJm2RGBE/wwmzXG7e3/EEfMfXLly5aAgSa1mp5MQ1akxyJ8o0qTmT1BbpZhU/e8r8HMKd6I6x9cjlIpozstz5QOExx8cSEUK7xAG14JJhsklsljE8SqpfOyDK2iizI8357glNSwPOR58MMAB4TKO+av2VhsrAao8YA4+hY4VZ5296AC9u476FYupFgv4QWdPW2EPbKSH890HvAVH3fwqicdG6nIjxJQReO0j0FCHCQCVmvf7HvMisPvBY92j1xCX2rjMnRI7OiFhGuoHLg9BpOb/CpNui/J7XAdXHj8GzsJvjP1kqyARJEkKnSZM1AanoaORuT++4sdcuLSziHdslptFjwcjlPUMRlFTxXYzlWoWTAOQIGb5DwCApAihlV7Mex0i3dR3B0On1uG6DYGghk5fY56DTnxx77vJAvImrajaGHoChCvyoGP9uqe5IVJqdgSc7K95GbW8YXASI0iPWNha/BuG2Ew3VZVIaqIVMVBHuFBs56M2eQNIuNwF7bEoUDhFKE3Wr2u5ftiUofgJSWylklF+0Yx1iGS206l2R5QE0DYBcLIPHAd/egSpWG0VkrUKb8t3xUS6//NkJ55s7qTgcrYWQKfVarcLhWZzq8u8vPp3m6jEhHDp6tO1tWfgX38rwAn1PiRp53/BwejTteN/8AvmaI29fzxdW19/imayym2cJBSQVIqHxyLfr673rtrxdU61o7X1lZX1Ix79lWlKOCE3TbGubON6traysnZkv/fF5Z8DYisrq08UOYdLhSposVInNbBzugcLPLXba9fyT1dXdNShv68k/1nh1TKIOuS+AH7DUXouMweC0SSC4atH2hGtZ0rtns61UzQG2e+RWnrg57HKKxLvrX2vpin80eoKsvva9/wCOA5B6XgdmvMHwGz1+/7eyvIPvXXQLAcbFfK99d4PsIrrPRu9qk9Wce8qJNbbQWrnt5DHWVl7+kxeBlMDmlq9KpvdRu+nTiNjPn++jmx6tVuqPTvq9dW/9hwcKDVha1CKrP26aMIqakAafZOurK/2jntrCnHlQO9YPtC7CiuwZiPfvgdsvC7rRSa7YkD/AKgeqMjRzEfSJ0ellXpyLIthNNafHx0/abZsRL1OgU70P3tjmYOGsNkuUvjoLYzzRKZDegjq2dp46itrVynCT858inRibAlwzvlovF6gYkTCgwl2yQX4Fg7XQx9PwBz4GLikg2zxiyYtIw2nUIWJ9AJ9jDCPicbJEIETSxPqBeZnIuHyUwVbvJ6yC2dd8PbxhNSP2yScM7CD2SNolmAy/wKx9gyO1+ApG5gdzs0AK36/Op41wuoT2DQIqb1o4o5wk4LbLzpPJ9MLUMxTNN4+1/kjayCju6jUBKFUQQ9Vds4TSBZA82Eel3B1Uqkj94ghtS/Y7NvI6ERxQteIFHOkfGaxfaWwvM6BbE0sdSh2eZp+wWqPynvCTiJ14B7l+hLiQkfC6hSGFhCdQOowe5S3LZFW3yI2L5TlOS4g9Um9OlIMzAXgUqZ5Lg0wgI9fRtMsJ5J6X+xwq3WcXwxxtlYQKLTuDn92EqkDz/6MQmt5KaEw9OuVZolIvIgTqSpJECfy6hBA7C6CIKspD15cxFvluxJOdKo4LorkpAlvH0DsZFEEH+0Q+CIy97RU5artYisl4K0JE94B9eM2LqRaxXaV6ywi+82Wtqp4sSVSGLGzdjLqIPElXZTYEnExv5BvUWJT4JELhAsv/vikt3qCaLraO/pRxDFCAJpJLcS1h3eKrZxECB3mp2tvnhyvTcR+fXXt+OjFq5+CHYGULrWLC3qbfyTKR0Upntm6durUtesvnjwH9FfX161rAI6vrq71nr+sXwfFT21ldiWxxC9wzpot1SLhn08hXHt1/cW/Xj5/etzrgSqsolqsI8ara2u93tPnR7+8uP7qmlz4TSRSKy18Uilz/ZSKa6AC11+/+PVfv7x8+W8ZL3/5Nfn6OiB9TVPulS2+i7D00ykrXBvA8qwtvlTmhYaRdS36dF9r/vh54WoBco8NIWfG39UHcO3FonlDlH8cMPpNb/XfDNR/Gxx4ZZNvforU3lyz1IvpGSjnf/rZPisFsqXXrywEYi2fVz+X7GFyBexe+vUrS1+iw7VXr19EbUUcoSm28q8N7ltDGjj81/l21S6TAlqwBZwkhaLYabVf/P76zZs312W8ef3777//vduCS6tICm/awCkaEUYbCkHnB8eb8O0y4UhYBsuyjiSFk3Bxu58s2HANFT/YvyGYI2VaUNY4kh1+/tTGoQy7qQTmwlyCeSC0hrrfmAcjRdtM3qmoiAeP0eJowmLTyDbadQ8KHCx2yMsa29+hld1wQMnMDg7wYWjt93c2WlDSR1fegeF3ERaayFQBdVTgsR0mkQxIHihbNsiOeTE936H88vYIvy2yXT2auB/tNPJTFvO5WTgr7PEfHLioxXSkRyFcwIEHga6baptdd0TZtIfJ76qwF5Bd0SJ1smC2K5vq7ze0zRy7Cr46IJeyOJ3qxyu8uohtJSOxlxIFAqdAWKKsXq2Tpwj4Ak1CEFO26FBrEd2rdPOpdqcqdqxWdnU7YrXTTuW7lfK7eIvaO0UNvYcqmymX96wmRGt78LsdYQuNLHq+1AR1f1HWyqzRwZIA1nYxSY00GatFaZWMRUmbQLVl2So3LO9ZlLQHWNWW2nXfA/BqSja/fdSTIaw2vpLVShfteZv1k3i1bVpaVdM4bbYpSStw62aoHrVsCwuExpRDqI92ngtETf1aSGvqqt8P2ysm8bsDD8Jar/BW6xbd5WdPaFKw6buNT9Jobx2bLVl3PkulrHy+e7dxd0Fbe82IHMLvOtq/e//jjz++f/OstdW7Z2+i83dR2Rs2cZCH6KsbQyH5p3sIdfk7ruQvowo1btjC7lHdV8G5960FU9N/EettW7iZj916UtZdicpZ/RfpPZozSyuw9/XUb1rLOHtTT30eX5g8FjqrhxrDctp0Q8fdDlZ3lPY1X2I33HeEb2jL/dkWcYm9sY+8C/ya30+SwzPacPJuQykY2p/zy0mGIZy+ebvRaNz+9FZ69EBFJn3rU1Typn1y9mylVCtFM+P5hDNRULJig7XrSyyxxBJLLLHEEkssscQSSyyxxBJLLLHEEv9/8H+ZNGmv4t356gAAAABJRU5ErkJggg=='
    ,like: 10,
    star: 3,
    review: 3,
    operation: 0

  }
]

const App = () => {



  const [status, setStatus] = useState('모두')
  const [datalist, setDatalist] = useState(data)


  const setStatusFilter = status => {
    if(status !== '모두') { // han and jung
      setDatalist([...data.filter(e => e.status === status)])
    }else{
      setDatalist(data)
    }
    setStatus(status)
  }

  const renderItem = ({item, index}) =>{
    return(
      <TouchableOpacity>
      <View key={index} style ={styles.itemContainer}>
        
        {/*
        <Button
        title="Press me"
        color="gray"
        onPress={() => Alert.alert('Simple Button pressed')}
      />

        */}



        <View style={styles.itemLogo}>
          <Image
            style={styles.itemImage}
            source={{uri: item.image}}
          />
        </View>
        
        <View style={styles.itemBody}>
          <Text style={styles.itemName}>{item.name}</Text>
        </View>
        
        <View style={styles.itemIconBody}>

            
            <Text style={styles.itemLike}>
              <Image
                  style={styles.itemIcon}
                  source={{uri: 'https://i.pinimg.com/originals/39/44/6c/39446caa52f53369b92bc97253d2b2f1.png'}}
                /> {item.like}  </Text>
            <Text style={styles.itemLike}>
              <Image
                    style={styles.itemIcon}
                    source={{uri: 'https://cdn3.vectorstock.com/i/1000x1000/31/77/star-icon-isolated-on-background-modern-simple-sp-vector-21073177.jpg'}}
                  /> {item.star}  </Text>
            <Text style={styles.itemLike}>
                <Image
                  style={styles.itemIcon}
                  source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5osTFTdlco7oBcppJ5-StA8r9ZhY8rfug3Q&usqp=CAU'}}
                /> {item.review}</Text>
        </View>
        
        <View style={[
          styles.itemStatus,
          {backgroundColor: item.status === '배달x' ? '#F5F5F5': '#FFAB91'}]}
          >
          <Text>{item.status}</Text>
        </View>

      </View>
      </TouchableOpacity>
    )
  }

  const separator =() => {
    return <View style={{height:1,backgroundColor:'#f1f1f1'}}/>
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listTab}> 
      {
          listTab.map(e => (
            <TouchableOpacity
              style={[styles.btnTab, status === e.status && styles.btnTabActive]}
              onPress={() => setStatusFilter(e.status)}
            >
              <Text style={styles.textTab}>
                {e.status}
              </Text>
            </TouchableOpacity>
            ))
          }
      </View>
      
      <FlatList
        data={datalist}
        keyExtractor={(e, i) => i.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={separator}
      />
      

    </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
  listTab: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 20
  },
  btnTab: {
    width: Dimensions.get('window').width / 3.5,
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#EBEBEB',
    padding: 10,
    justifyContent:'center'
  },
  textTab: {
    fontSize:16
  },
  btnTabActive: {
    backgroundColor: '#90CAF9'
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical:15
  },
  itemLogo: {
    padding: 10
  },
  itemImage:{
    width:50,
    height:50
  },
  itemBody:{
    height: Dimensions.get('window').width / 18,
    flex:1,
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 16
  },
  itemStatus: {
    height: Dimensions.get('window').width / 18,
    backgroundColor: '#FBE9E7',
    paddingHorizontal: 3,
    justifyContent:'flex-start',
    right: 12
  },
  itemOperation: {
    height: Dimensions.get('window').width / 18,
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 3,
    justifyContent:'flex-end',
    right: 12
  },
  itemIconBody: {
    flex:1,
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  itemLike: {
    fontWeight: 'bold',
    fontSize: 16
  },
  itemIcon: {
    width:20,
    height:20
  }
})


