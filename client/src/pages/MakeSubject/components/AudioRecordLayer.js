import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import AudioRecord from '../../../component/AudioRecord';

/**
 * props:
 * saveAudioRecord: 保存录音回调；参数 audioSource: 录音在内存中的 url
 * */
export default class AudioRecordLayer extends Component{
    constructor(props){
        super(props);
        this.state = {
            isRecording: false,
            audioSource: '',
        };
    }

    _renderButtons(){
        return (
            <div style={styles.buttonsContainer}>
                <AudioRecord
                    startRecordId={'startRecording'}
                    stopRecordId={'stopRecording'}
                    onAudioRecordStart={this._onAudioRecordStart}
                    onAudioRecordFinished={this._onAudioRecordFinished}
                />
                {
                    this.state.isRecording ?
                        <Button type={'primary'} size={'large'} loading>正在录音...</Button>
                        :
                        <Button type={this.state.audioSource ? 'default' : 'primary'} size={'large'}>
                            <label htmlFor={'startRecording'}>{this.state.audioSource ? '重新录音' : '开始录音'}</label>
                        </Button>
                }
                <div style={{width: 40, height: 20}}/>
                {
                    this.state.audioSource ?
                        <Button type={'primary'} size={'large'} onClick={this.saveAudioRecord}>保存录音</Button>
                        :
                        <Button htmlFor={'stopRecording'} type={'default'} size={'large'} disabled={!this.state.isRecording}>
                            <label htmlFor={'stopRecording'}>结束录音</label>
                        </Button>
                }
            </div>

        );
    }

    saveAudioRecord = () => {
        this.props.saveAudioRecord && this.props.saveAudioRecord(this.state.audioSource);
    };

    render(){
        return (
            <div style={styles.container}>
                {this._renderButtons()}
                {this.state.audioSource ? <audio src={this.state.audioSource} style={styles.audio} controls={'controls'}/> : null}
                <Icon type="close" style={styles.closeIcon} onClick={this.onCloseIconClick}/>
            </div>
        );
    }

    _onAudioRecordStart = () => {
        this.setState({isRecording: true})
    };

    _onAudioRecordFinished = (src) => {
        this.setState({
            isRecording: false,
            audioSource: src
        });
    };

    onCloseIconClick = () => {
        this.props.onClose && this.props.onClose();
    }
}

const styles = {
    container: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    audio: {
        width: '60%',
        marginTop: 60,
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    closeIcon: {
        color: 'white',
        position: 'absolute',
        top: 20,
        right: 20,
        fontSize: 20,
    }
};