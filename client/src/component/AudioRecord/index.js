import React, { Component } from 'react';
import Recorder from './Recorder';

/**
 * props:
 * startRecordId: 开始录音的 id, 外部配合 label htmlFor 使用
 * stopRecordId: 结束录音的 id 外部配合 label htmlFor 使用
 * onAudioRecordStart: 开始录音后的回调函数；
 * onAudioRecordFinished: 结束录音后的回调函数；参数 src : 音频在内存中的 url
 * */
export default class AudioRecord extends Component{
    constructor(props){
        super(props);
        this.recorder = null;
    }

    render(){
        return (
            <div>
                <input style={{display: 'none'}} onClick={this._startRecording} id={this.props.startRecordId}/>
                <input style={{display: 'none'}} onClick={this._stopRecording} id={this.props.stopRecordId}/>
            </div>
        );
    }

    _startRecording = () => {
        navigator.getUserMedia({audio: true}, (s) => {
            const context = new AudioContext();
            const mediaStreamSource = context.createMediaStreamSource(s);
            this.recorder = new Recorder(mediaStreamSource);
            this.recorder.record();
        }, (e) => {
            console.log(console.log(`error: ${e}`));
        });
        this.props.onAudioRecordStart && this.props.onAudioRecordStart();
    };

    _stopRecording = () => {
        this.recorder.stop();
        this.recorder.exportWAV((s) => {
            const src = window.URL.createObjectURL(s);
            this.props.onAudioRecordFinished && this.props.onAudioRecordFinished(src);
        });
    };

    componentWillUnmount(){
        this.recorder && this.recorder.stop();
    }
}