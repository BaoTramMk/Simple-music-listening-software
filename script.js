const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'PLAYER_STORAGE'


const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const playList = $('.playlist')

const cdList = $('.cd-list')
const progress = $('.progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const songActive = $('.song.active')

const app = {
    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) ||{},
    songs : [
        {
            name : 'Bad bye',
            singer : 'Wean',
            path : './music/badbye.mp3',
            image : './img/badbye.jpg',
        },
        {
            name : 'Em khiến anh muốn trở thành người Hà Nội',
            singer : 'Negav',
            path : './music/em khien anh muon tro thanh nguoi ha noi.mp3',
            image : './img/negav.jpg',
        },
        {
            name : 'Bad bye',
            singer : 'Wean',
            path : './music/badbye.mp3',
            image : './img/badbye.jpg',
        },
        {
            name : 'Em khiến anh muốn trở thành người Hà Nội',
            singer : 'Negav',
            path : './music/em khien anh muon tro thanh nguoi ha noi.mp3',
            image : './img/negav.jpg',
        },
        {
            name : 'Bad bye',
            singer : 'Wean',
            path : './music/badbye.mp3',
            image : './img/badbye.jpg',
        },
        {
            name : 'Em khiến anh muốn trở thành người Hà Nội',
            singer : 'Negav',
            path : './music/em khien anh muon tro thanh nguoi ha noi.mp3',
            image : './img/negav.jpg',
        },
        {
            name : 'Bad bye',
            singer : 'Wean',
            path : './music/badbye.mp3',
            image : './img/badbye.jpg',
        },
        {
            name : 'Em khiến anh muốn trở thành người Hà Nội',
            singer : 'Negav',
            path : './music/em khien anh muon tro thanh nguoi ha noi.mp3',
            image : './img/negav.jpg',
        },
        {
            name : 'Bad bye',
            singer : 'Wean',
            path : './music/badbye.mp3',
            image : './img/badbye.jpg',
        },
    ],
    setConfig : function (key , value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY , JSON.stringify(this.config))
    },
    render : function (){
        const html = this.songs.map((song, index) => {
            return ` 
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}" >
                    <div
                        class="thumb"
                        style="
                            background-image: url('${song.image}');
                        "
                    ></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>`
        })
        playList.innerHTML = html.join('')
    },
    defineProperties : function() {
        Object.defineProperty(this, 'currentSong', {
            get : function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent : function(){
        const _this = this
        document.onscroll = function() {
            const cdWidth = cd.offsetWidth
            // xu li phong tho thu nho CD
            document.onscroll = function () {
                const scrolltop = window.scrollY || document.documentElement.scrollTop
                const newCfWidth = cdWidth - scrolltop

                cd.style.width = newCfWidth > 0 ? newCfWidth + 'px' : 0
                cd.style.opacity = newCfWidth / cdWidth
            }
        }
        //xu li khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }
        }
        audio.onplay = function() {
            _this.isPlaying =true
            player.classList.add('playing')
            cdThumbAminate.play()
        };

        //xu li click stop
        audio.onpause = function() {
            _this.isPlaying =false
            player.classList.remove('playing')
            cdThumbAminate.pause()

        };
        
        //khi tien do bai hat thay doi 
        audio.ontimeupdate = function() {
            if(audio.duration){
                const percent= Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = percent
            }
        }

        // xu li tua
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }
        
        //xu li next
        nextBtn.onclick = function() {
            if(_this.isRandom){
                _this.randomSong()
            }
            else{
                _this.nextSong()
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong()
        }

        //xu li prev
        prevBtn.onclick = function() {
            if(_this.isRandom){
                _this.randomSong()
            }
            else{
                _this.prevSong()
            }
            audio.play();
            _this.render();
        }

        // xu li quay cd & dung
        const cdThumbAminate = cdThumb.animate([
            {
                transform : 'rotate(360deg)'
            }
        ],{
            duration : 10000,
            iterations : Infinity
        })
        cdThumbAminate.pause()
        
        //xu li random
        randomBtn.onclick = function() {
            _this.isRandom =!_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //xu ly next khi end
        audio.onended = function() {
            if(_this.isRandom){
                _this.randomSong()
            }
            else{
                _this.prevSong()
            }
            audio.play();
        }
        //xu li repeat
        repeatBtn.onclick = function () {
            _this.isRepeat =!_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        audio.onended = function() {
            if(_this.isRepeat){
                audio.play ()
            }
            else{
                nextBtn.click()
            }
        }

        //lang nghe su kien click vao playlist
        playList.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.options')){
                 //xu li khi click vao song
                if(songNode)  {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                //xu li click vao song option
                if (e.target.closest('.options')) {

                }
             }
        }
    },


    loadCurrentSong : function() {
        

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundColor = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

        // console.log(heading, cdThumb, audio)
    },
    
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

        // Object.assign(this , this.config)
    },

    nextSong : function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong : function() {
        this.currentIndex--
        if(this.currentIndex <= 0) {
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },

    randomSong : function() {
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    scrollToActiveSong : function() {
        setTimeout (() => {
            songActive.scrollIntoView({
                behavior :'smooth',
                block :'nearest',
                inline : 'nearest'
            })
        }, 300)
    },


    start : function() {
        //gan cau hinh tu config vao opject
        this.loadConfig()
        //dinh nghia cac thuoc tinh cho  object
        this.defineProperties();
        //lang nghe cac suj kien
        this.handleEvent();
        //render playlist
        this.render();
        //tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong()

        //hien thi trang thai ban dau cua button repeat & random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)

    }
}
app.start()