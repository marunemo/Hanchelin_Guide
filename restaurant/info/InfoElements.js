import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Text from '../../defaultSetting/FontText';
import { IconButton, Icon, Modal, Button } from 'native-base';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Font from 'react-native-vector-icons/FontAwesome';

const KeyTextView = (props) => {
  return (
    <View style={style.titleView}>
      <Text style={style.keyText} bold>
        {props.keyText}
      </Text>
    </View>
  )
}

const InfoView = (props) => {
  return (
    <View style={style.contexts}>
      <View style={style.iconView}>
        <Font
          name={props.icon}
          color="#555"
          size={22}
        />
      </View>
      <Text style={{ fontSize: 16, marginVertical: 3, color: '#444' }}>
        {props.value}
      </Text>
    </View>
  )
}

const MenuListView = (props) => {
  const [food, price] = props.order.split(': ');

  return (
    <View style={style.menuView}>
      <Text style={{ fontWeight: 'bold', color: '#444' }}>{food}</Text>
      <Text style={{ color: '#444' }}>{price}원</Text>
    </View>
  )
}

const CommentListView = (props) => {
  const [settingVisible, setSettingVisible] = useState(false);
  const id = props.id;
  const comment = props.comment;
  const commentUser = comment['user'];

  const dateTimeFormat = (writtenDate) => {
    const date = new Date(writtenDate);
    const diffDate = new Date(new Date() - date);
    if (diffDate.getTime() < 60 * 1000) {
      return '·····  ' + diffDate.getSeconds().toString() + '초 전';
    } else if (diffDate.getTime() < 60 * 60 * 1000) {
      return '·····  ' + diffDate.getMinutes().toString() + '분 전';
    } else if (diffDate.getTime() < 24 * 60 * 60 * 1000) {
      return '·····  ' + diffDate.getUTCHours().toString() + '시간 전';
    } else {
      return date.getFullYear().toString() + '/' + (date.getMonth() + 1).toString() + '/' + date.getDate().toString()
        + ' ' + (date.getHours() < 10 ? '0' : '') + date.getHours().toString() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes().toString();
    }
  }

  return (
    <View style={style.commentsView}>
      <View style={style.commentHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            style={style.userProfile}
            source={{ uri: commentUser['profile'] }}
          />
          <View>
            <Text style={{ fontSize: 16, marginBottom: 4, color: '#222' }} bold>{commentUser['name']}</Text>
            <Text style={{ fontSize: 12, textAlign: 'right', color: '#4b4b4b' }}>{dateTimeFormat(comment['작성시간'])}</Text>
          </View>
        </View>
        <IconButton
          size="sm"
          variant="outline"
          colorScheme="dark"
          borderRadius="full"
          borderColor="#71717a"
          borderWidth={1}
          onPress={() => setSettingVisible(true)}
          icon={<Image
            source={require('../../images/trash.png')}
            alt="Alternate Text"
            style={{ width: 23, height: 23, tintColor: "#71717a" }}
          />}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={style.commentsText}>종합 : {comment['종합']}</Text>
        <Text style={style.commentsText}>맛 : {comment['맛']}</Text>
        <Text style={style.commentsText}>가성비 : {comment['가성비']}</Text>
        <Text style={style.commentsText}>서비스 : {comment['서비스']}</Text>
      </View>
      {comment['리뷰'] !== '' &&
        <View style={style.commentsReview}>
          <Text style={style.commentsText}>
            {comment['리뷰']}
          </Text>
        </View>
      }
      {comment['배달여부'] &&
        <Text style={[style.commentsText, { textAlign: 'right' }]}>
          배달 시간 : {comment['배달시간']}분    배달비 : {comment['배달비']}원
        </Text>
      }
      <CommentListSetting
        isVisible={settingVisible}
        setVisible={setSettingVisible}
        userName={commentUser['name']}
        isMine={props.user.uid === commentUser['uid']}
        onPop={() => {
          props.onPop(id, comment.query);
          setSettingVisible(false);
        }}
      />
    </View>
  )
}

const CommentListSetting = (props) => {
  const SettingButton = (props) => {
    return (
      <Button
        style={style.modalButton}
        variant="ghost"
        colorScheme={props.color}
        onPress={props.onPress}
      >
        {props.children}
      </Button>
    )
  }

  const SettingButtonGroup = (props) => {
    if (props.isMine) {
      return (
        <Button.Group style={style.modalButtonGroup}>
          <SettingButton color="cyan">
            대댓글
          </SettingButton>
          <SettingButton color="rose" onPress={props.onPop}>
            삭제
          </SettingButton>
        </Button.Group>
      )
    } else {
      return (
        <Button.Group style={style.modalButtonGroup}>
          <SettingButton color="cyan">
            대댓글
          </SettingButton>
          <SettingButton color="cyan">
            공감
          </SettingButton>
          <SettingButton color="rose">
            신고
          </SettingButton>
        </Button.Group>
      )
    }
  }

  return (
    <Modal isOpen={props.isVisible} onClose={props.setVisible}>
      <Modal.Content style={style.modalContent}>
        <Modal.Header>
          {props.userName + '님의 리뷰'}
        </Modal.Header>
        <Modal.CloseButton />
        <Modal.Body>
          <SettingButtonGroup
            isMine={props.isMine}
            onPop={props.onPop}
          />
        </Modal.Body>
      </Modal.Content>
    </Modal>
  )
}

const RatingBar = (props) => {
  const backgroundText = props.bgText;
  const textColor = props.textColor;
  const ratingName = props.ratingName;
  const ratingData = props.ratingData;

  return (
    <View style={style.ratingView}>
      <View style={[style.ratingTextView, { backgroundColor: backgroundText }]}>
        <Text style={[style.ratingText, { color: textColor }]} bold>{ratingName}</Text>
      </View>
      <AnimatedCircularProgress
        tintColor={props.color}
        backgroundColor="#ddd"
        size={80}
        width={10}
        rotation={0}
        fill={!ratingData ? 0 : ratingData * 20}
        duration={1000}
      >
        {(fill) => (
          <Text style={{ fontSize: 20 }}>
            {Math.round(ratingData * 10) / 10}
          </Text>
        )}
      </AnimatedCircularProgress>
    </View>
  )
}

export { KeyTextView, InfoView, MenuListView, CommentListView, CommentListSetting, RatingBar };

const style = StyleSheet.create({
  contexts: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  keyText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 7,
    marginHorizontal: 12
  },
  titleView: {
    backgroundColor: '#BF2A52',
    borderRadius: 7,
    marginVertical: 5,
    marginHorizontal: 10
  },
  iconView: {
    width: 18,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ratingView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5
  },
  ratingTextView: {
    width: 60,
    height: 28,
    justifyContent: 'center',
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 5
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 14,
  },
  menuView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#ededed',
    borderBottomWidth: 0.5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
    marginHorizontal: 25
  },
  commentsView: {
    borderTopWidth: 0.5,
    borderColor: '#ededed',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 17
  },
  commentHeader: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  commentsText: {
    color: '#333',
    fontSize: 14,
    marginVertical: 8,
    paddingHorizontal: 10
  },
  commentsReview: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 7,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  userProfile: {
    height: 40,
    aspectRatio: 1,
    borderRadius: 20,
    marginVertical: 5,
    marginRight: 12
  },
  modalButtonGroup: {
    flexDirection: 'column'
  },
  modalButton: {
    width: '100%'
  }
})