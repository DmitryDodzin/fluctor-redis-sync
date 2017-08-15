
const Redis = require('ioredis');
const EventEmitter = require('events');
  
const channels = require('./channels');

class RedisSync extends EventEmitter {

  constructor(options) {
    super();

    this.redis_sub = Redis(options);
    this.redis_pub = this.redis_sub.duplicate();
    this.redis_sub.on('ready', () => this._setup());    
  }

  _setup() {
    this._subscribeToChannels();
    this._bindEventHandlers();
    this.emit('ready', this);
  }

  _bindEventHandlers() {
    this.redis_sub.on('error', err => this.emit('error', err));
    this.redis_pub.on('error', err => this.emit('error', err));
  }

  _subscribeToChannels() {
    Object.keys(channels)
      .forEach(channel => this.redis_sub.subscribe(channel));

    this.redis_sub.on('message', (channel, message) => {
      if(channel in channels){
        let type = channels[channel];
        let value = JSON.parse(message);

        if(this.waitQueue){
          this.waitQueue.push({ type, value });
        } else {
          this.emit(type, value);
        }
      }
    });
  }

  get wait() {
    let _this = this;
    return {
      start() {
        if(!_this.waitQueue)
          _this.waitQueue = [];
      },
      end(callback){
        callback(_this.waitQueue);
        delete _this.waitQueue;
      }
    };
  }


  _destroy() {
    for (let channel in channels){
      this.removeAllListeners(channels[channel]);
    }
    this.redis_sub.quit();
    this.redis_pub.quit();
  }
}

module.exports = RedisSync;