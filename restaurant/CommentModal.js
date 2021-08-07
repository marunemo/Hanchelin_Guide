import React, {useState} from "react";
import {Text, ScrollView, SafeAreaView, StyleSheet} from "react-native"
import {IconButton, Icon, Input, Button, Slider} from "native-base";
import Modal from "react-native-modal"
import {Rating, AirbnbRating} from "react-native-ratings";
import Font from "react-native-vector-icons/FontAwesome5"

const CommentButton = () => {
    const [onInput, showInput] = useState(false);
    const [isDeliver, setDeliver] = useState(false);

    function DeliverOption(props) {
        const [delivTime, setDelivTime] = useState(30);
        if(props.isDeliver) {
            return (
                <>
                    <Text style = {style.commentText}>배달시간</Text>
                    <Slider
                        w = "80%"
                        alignSelf = "center"
                        defaultValue = {30}
                        maxValue = {60}
                        step = {5}
                        onChange = {time => {setDelivTime(time)}}
                        onChangeEnd = {time => {console.log("Due time : " + time)}}>
                        <Slider.Track>
                            <Slider.FilledTrack/>
                        </Slider.Track>
                        <Slider.Thumb/>
                    </Slider>
                    <Text style = {{textAlign : "right"}}>{delivTime}분{(delivTime == 60)?" 이상":""}</Text>
                    <Text style = {style.commentText}>배달비</Text>
                    <Input
                        size = "sm"
                        w = {250}
                        keyboardType="numeric"
                        variant = "underlined"
                        alignSelf = "flex-end"
                        textAlign = "right"
                        multiline = {false}
                        InputRightElement = {<Text style = {{fontWeight : "bold"}}>원</Text>}
                        placeholder = "들었던 배달 비용을 적어주세요." />
                </>
            )
        }
        return (<></>)
    }

    return (<>
                <Modal
                    style = {{justifyContent : "flex-end", alignItems : "center"}}
                    isVisible = {onInput}
                    onBackButtonPress = {() => showInput(false)}
                    onBackdropPress = {() => showInput(false)} >
                    <SafeAreaView style = {style.commentView}>
                        <Text style = {style.commentHeader}>식당 리뷰</Text>
                        <ScrollView showsVerticalScrollIndicator = {false}>
                            <Text style = {style.commentText}>주문 방식</Text>
                            <Button.Group alignSelf = "center">
                                <Button
                                    colorScheme = {isDeliver?"rgb(11, 153, 91)":"rgb(6, 209, 120)"}
                                    onPress = {() => setDeliver(true)}>
                                    배달
                                </Button>
                                <Button
                                    colorScheme = {!isDeliver?"rgb(11, 153, 91)":"rgb(6, 209, 120)"}
                                    onPress = {() => setDeliver(false)}>
                                    방문
                                </Button>
                            </Button.Group>
                            <DeliverOption isDeliver = {isDeliver} />
                            <Text style = {style.commentText}>맛</Text>
                            <Rating
                                showRating = {true}
                                imageSize = {20}
                                fractions = {1}
                                onFinishRating = {function(rating) {console.log("Taste is: " + rating)}} />
                            <Text style = {style.commentText}>가성비</Text>
                            <Rating
                                showRating = {true}
                                imageSize = {20}
                                fractions = {1}
                                onFinishRating = {function(rating) {console.log("Pay is: " + rating)}} />
                            <Text style = {style.commentText}>서비스</Text>
                            <Rating
                                showRating = {true}
                                imageSize = {20}
                                fractions = {1}
                                onFinishRating = {function(rating) {console.log("Service is: " + rating)}} />
                            <Text style = {style.commentText}>종합 평가</Text>
                            <AirbnbRating
                                starImage = {require("./rice-icon.jpeg")}
                                count={5}
                                reviews={["다시는 안 먹어요..", "가끔씩은 괜찮을 듯?", "무난해요.", "꽤 자주 갈꺼 같아요", "없던 병이 낫는 식당"]}
                                defaultRating={2.5}
                                selectedColor = "#13ACBF"
                                size={25}
                                reviewColor = "#13ACBF"
                                reviewSize = {18}
                                onFinishRating = {function(rating) {console.log("Total is: " + rating)}} />
                            <Input
                                style = {{marginVertical : 20}}
                                w = {270}
                                minHeight = {150}
                                variant = "filled"
                                textAlignVertical = "top"
                                multiline = {true}
                                placeholder = "해당 식장에 대한 총평을 적어주세요." />
                        </ScrollView>
                        <IconButton
                            onPress={() => showInput(false)}
                            icon = {<Icon name = "window-close" as = {Font} size="sm" />} />
                    </SafeAreaView>
                </Modal>
                <IconButton
                    style = {style.commentButton}
                    borderRadius="full"
                    colorScheme="cyan"
                    variant="solid"
                    size = "lg"
                    onPress={() => showInput(true)}
                    icon = {<Icon name = "comment-alt" as = {Font} size="sm" />} />
            </>)
}

export default CommentButton;

const style = StyleSheet.create({
    commentView : {
        backgroundColor : "white",
        borderRadius : 25,
        width : "95%",
        height : "80%",
        alignItems : "center",
        alignSelf : "center",
    },
    commentButton : {
        position : "absolute",
        bottom : 30,
        right : 30,
    },
    commentHeader : {
        fontWeight : "bold",
        marginVertical : 25,
        fontSize : 22
    },
    commentText : {
        fontWeight : "bold",
        alignSelf : "flex-start",
        fontSize : 16,
        paddingHorizontal : 16,
        marginTop : 15,
        marginBottom : 8
    }
})