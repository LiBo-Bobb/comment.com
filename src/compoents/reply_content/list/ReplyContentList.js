import React, {Component} from 'react';
import ReplyContentItem from '../item/ReplyContentItem'

export default class ReplyContentList extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let {replyContent, deletedChildComment} = this.props;
        return (<div style={{backgroundColor: "#fafafa", marginBottom: "50px"}}>
            {replyContent.map((item, index) => {
                return <ReplyContentItem
                    key={`replyContent${index}`}
                    //回复内容
                    content={item.content}
                    //用户图像
                    headimgurl={item.headimgurl}
                    //创建时间
                    created_at_display={item.created_at_display}
                    goodMarkedByMe={item.goodMarkedByMe}
                    //用户名
                    username={item.username}
                    //评论id
                    commentId={item.id}
                    deletedChildComment={deletedChildComment}
                    goodCount={item.goodCount}
                />
            })}

        </div>)
    }

}