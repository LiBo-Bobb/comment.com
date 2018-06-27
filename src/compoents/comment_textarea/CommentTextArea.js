import React, {Component} from 'react';
import {TextArea, Form, FormCell, CellBody} from 'react-weui';
import './CommentTextArea.css';

export default class CommentTextArea extends Component {
    constructor(props) {
        super(props)
        this.state = {
            commentContent: "",
        }
    }


    render() {
        let {hideCommentTextArea, pubComment} = this.props;
        let {commentContent} = this.state;
        return (
            <div>
                <div className="weui-mask" onClick={() => {
                    hideCommentTextArea()
                }}>
                </div>
                <div className="commentTextAreaBoxGk">
                    <div className="btnBoxGk">
                        <div className="cancel_LI"
                             onClick={() => {
                                 hideCommentTextArea()
                             }}>
                            取消
                        </div>
                        <div
                            onClick={() => {
                                // console.log("----------", commentContent)
                                pubComment(commentContent)
                            }}
                            className="release_LI">
                            发布
                        </div>
                    </div>
                    <Form>
                        <FormCell>
                            <CellBody>
                            <TextArea
                                onChange={e => {
                                    // console.log("e.target.value...", e.target.value)
                                    this.setState({commentContent: e.target.value})
                                }}
                                placeholder="请输入..."
                                rows="4"
                                // maxlength="255"
                                autoFocus={true}>
                            </TextArea>
                            </CellBody>
                        </FormCell>
                    </Form>
                </div>
            </div>
        )
    }

}