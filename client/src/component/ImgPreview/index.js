import React, { Component } from 'react';

/**
 * props:
 * id: fileInput 的 id, 组件外配合 <label for = {id}/> 使用
 * onImgReady: 图片加载好后的回调，参数 imgSrcArr: 图片在内存中的 url, 可在 <img src = {src}/> 中使用
 **/
export default class ImgPreview extends Component{
    render(){
        return (
            <div>
                <input type={'file'}
                       multiple accept={'image/png, image/jpeg, image/jpg, image/svg, image/gif'}
                       id={this.props.id}
                       onChange={this._onChange}
                       style={{display: 'none'}}
                />
            </div>
        );
    }

    _onChange = (e) => {
        const files = Array.from(e.target.files);
        const imgSrcArr = [];
        files.forEach((item) => {
            imgSrcArr.push(this.createObjectUrl(item));
        });
        this.props.onImgReady && this.props.onImgReady(imgSrcArr);
    };

    createObjectUrl = (file) => {
        if (window.URL) {
            return window.URL.createObjectURL(file);
        } else {
            return window.webkitURL.createObjectURL(file);
        }
    };

    revokeObjectURL(file) {
        if (window.URL) {
            return window.URL.revokeObjectURL(file)
        } else {
            return window.webkitURL.revokeObjectURL(file)
        }
    }
}