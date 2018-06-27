import React, {Component} from 'react';
import './SingleComment.css'
import goodMark from '../../images/goodMark.png';
import cancelGoodMark from '../../images/cancelGoodMark.png'
import {API_zan} from '../../config'
import request from "superagent";

export default class SingleComment extends Component {
    constructor(props) {
        super(props)
        // console.log("single.......",props)
    }



    /**
     * 点赞评论
     * @param commentId  评论id
     */
    handleGoodMark = (commentId) => {
        let {loadTwoCommentList} = this.props;
        request.post(API_zan)
            .set({'Content-Type': 'application/x-www-form-urlencoded', 'token': "zxcvoiuasdfoiuy01982734"})
            .send({
                "commentId": commentId,
                "remarkType": 1
            })
            .end(
                (err, res) => {
                    if (err === null) {
                        console.log("点赞当前评论22.......")
                        console.log(res.body)
                        let {err, result: {goodMarkedByMe}} = res.body;
                        this.setState({goodMarkedByMe})
                        loadTwoCommentList(commentId)
                    } else {

                    }
                }
            )
    }

    render() {
        // console.log("this.props.....",this.props)
        let {content, goodCount, username, created_at_display, headimgurl, replyCommentId,goodMarkedByMe} = this.props
        return (<div className="singleCommentBox">
            <div className="leftHeadImg">
                <img style={{width: "100%"}} src={headimgurl} alt="用户图像"/>
            </div>
            <div className="rightContentArea">
                <div className="firstLineContent">
                    <div className="userName">
                        {username}
                    </div>
                    <div className="goodMark">
                        <div className="singleGoodMarkIcon" onClick={() => {
                            this.handleGoodMark(replyCommentId)
                        }
                        }>
                            <img src={goodMarkedByMe?goodMark:cancelGoodMark} style={{width: "100%"}} alt=""/>
                        </div>
                        <div className="singleGoodMarkCount">
                            {goodCount}
                        </div>
                    </div>
                </div>
                <div className="secondLineContent">
                    <div className="showTime">
                        {created_at_display}
                    </div>
                    <div className="replyBtn">
                        {/*回复*/}
                    </div>
                </div>
                <div className="commentContent">
                    {content}
                </div>
            </div>
        </div>)
    }

}