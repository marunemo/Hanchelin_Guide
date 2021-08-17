import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { IconButton, Icon, Progress } from 'native-base';
import Font from 'react-native-vector-icons/FontAwesome';

const KeyTextView = (props) => {
	return (
		<View style={style.titleView}>
			<Text style={style.keyText}>
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
					color="#666666"
					size={22}
				/>
			</View>
			<Text style={{ fontSize: 16, marginVertical: 3 }}>
				{props.value}
			</Text>
		</View>
	)
}

const MenuListView = (props) => {
	const [food, price] = props.order.split(': ');

	return (
		<View style={style.menuView}>
			<Text style={{ fontWeight: 'bold' }}>{food}</Text>
			<Text>{price}원</Text>
		</View>
	)
}

const CommentListView = (props) => {
	const id = props.id;
	const comment = props.comment;

	return (
		<View style={style.commentsView}>
			<IconButton
				alignSelf="flex-end"
				size="sm"
				borderRadius="full"
				onPress={() => props.onPop(id, comment.query)}
				icon={<Icon name="trash-o" as={Font} size="sm" color="#831843" />}
			/>
			<Text style={style.commentsText}>맛 : {comment['맛']}</Text>
			<Text style={style.commentsText}>가성비 : {comment['가성비']}</Text>
			<Text style={style.commentsText}>서비스 : {comment['서비스']}</Text>
			<Text style={style.commentsText}>종합 : {comment['종합']}</Text>
			{comment['리뷰'] !== '' &&
				<Text style={style.commentsText}>
					리뷰 : {comment['리뷰']}
				</Text>
			}
			{comment['배달여부'] &&
				<Text style={style.commentsText}>
					배달 시간 : {comment['배달시간']}분    배달비 : {comment['배달비']}원
				</Text>
			}
			<Text style={{ textAlign: 'right', color: '#4b4b4b' }}>{comment['작성시간']}</Text>
		</View>
	)
}

const RatingBar = (props) => {
	const backgroundText = props.bgText;
	const textColor = props.textColor;
	const ratingName = props.ratingName;
	const ratingData = props.ratingData;
	const theme = props.theme;

	return (
		<View style={style.ratingView}>
			<View style={[style.ratingTextView, { backgroundColor: backgroundText }]}>
				<Text style={[style.ratingText, { color: textColor }]}>{ratingName}</Text>
			</View>
			<Progress
				rounded="0"
				colorScheme={theme}
				width={75}
				height={14}
				max={5}
				value={ratingData}
			/>
			<Text>{ratingData}</Text>
		</View>
	)
}

export { KeyTextView, InfoView, MenuListView, CommentListView, RatingBar };

const style = StyleSheet.create({
	contexts: {
		flexDirection: 'row',
		marginVertical: 6,
	},
	keyText: {
		color: '#033326',
		fontSize: 16,
		fontWeight: 'bold',
		marginVertical: 3,
		marginHorizontal: 10
	},
	titleView: {
		backgroundColor: '#86efac',
		borderRadius: 50,
		marginHorizontal: 5
	},
	iconView: {
		width: 18,
		marginRight: 10,
		justifyContent: "center",
		alignItems: "center"
	},
	ratingView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginVertical: 3
	},
	ratingTextView: {
		width: 52,
		height: 22,
		justifyContent: 'center',
		borderRadius: 50,
		marginHorizontal: 5
	},
	ratingText: {
		textAlign: 'center',
		fontSize: 14,
		fontWeight: 'bold'
	},
	menuView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#d1d1d1',
		paddingVertical: 5,
		paddingHorizontal: 10,
		marginBottom: 5,
		marginHorizontal: 10
	},
	commentsView: {
		borderWidth: 1,
		borderRadius: 20,
		borderColor: '#ec4899',
		backgroundColor: '#fbcfe8',
		width: '100%',
		marginVertical: 5,
		paddingVertical: 5,
		paddingHorizontal: 20
	},
	commentsText: {
		color: '#1c1917',
		fontSize: 14,
		marginVertical: 3
	}
})