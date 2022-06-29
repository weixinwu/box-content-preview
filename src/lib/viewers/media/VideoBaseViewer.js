import throttle from 'lodash/throttle';
import ControlsRoot from '../controls';
import MediaBaseViewer from './MediaBaseViewer';
import { CLASS_HIDDEN, CLASS_IS_BUFFERING, CLASS_DARK } from '../../constants';
import { ICON_PLAY_LARGE } from '../../icons';
import { getComments, addComment, addLike, removeLike, removeComment } from '../../db/comments';
import { getCurrentUser } from '../../db/user';
import { uploadFile } from '../../db/file';

const MOUSE_MOVE_TIMEOUT_IN_MILLIS = 1000;
const CLASS_PLAY_BUTTON = 'bp-media-play-button';
const CLASS_VIEW_NOTE_BUTTON = 'bp-media-view-note-button';
class VideoBaseViewer extends MediaBaseViewer {
    /**
     * @inheritdoc
     */
    constructor(options) {
        super(options);

        // Bind context for handlers
        this.handleControlsHide = this.handleControlsHide.bind(this);
        this.handleControlsShow = this.handleControlsShow.bind(this);
        this.loadeddataHandler = this.loadeddataHandler.bind(this);
        this.pointerHandler = this.pointerHandler.bind(this);
        this.waitingHandler = this.waitingHandler.bind(this);
        this.playingHandler = this.playingHandler.bind(this);
        this.pauseHandler = this.pauseHandler.bind(this);
        this.resize = this.resize.bind(this);

        getComments('977307283157').then(comments => {
            console.log('comments', comments);
        });
        // addComment('976635531627', '1231231', 124, 'hello world').then(comment => {
        //     console.log('new comment', comment);
        // });
        // removeLike('976635531627', '1656491044890_mv1mim2ut6i', '1231231');
        removeComment('976635531627', '1656491044890_mv1mim2ut6i');
    }

    /**
     * @inheritdoc
     */
    setup() {
        if (this.isSetup) {
            return;
        }

        // Call super() to set up common layout
        super.setup();

        // Video element
        this.mediaEl = this.mediaContainerEl.appendChild(document.createElement('video'));
        this.mediaEl.setAttribute('preload', 'auto');
        // Prevents native iOS UI from taking over
        this.mediaEl.setAttribute('playsinline', '');

        // Play button
        this.playButtonEl = this.mediaContainerEl.appendChild(document.createElement('div'));
        this.playButtonEl.classList.add(CLASS_PLAY_BUTTON);
        this.playButtonEl.classList.add(CLASS_HIDDEN);
        this.playButtonEl.innerHTML = ICON_PLAY_LARGE;

        // video note popup button
        this.viewNoteButtonEl = this.mediaContainerEl.appendChild(document.createElement('div'));
        this.viewNoteButtonEl.classList.add(CLASS_VIEW_NOTE_BUTTON);
        this.viewNoteButtonEl.classList.add(CLASS_HIDDEN);
        const button = this.viewNoteButtonEl.appendChild(document.createElement('button'));
        button.innerHTML = 'View Note';

        this.fileButtonEl = this.mediaContainerEl.appendChild(document.createElement('input'));
        this.fileButtonEl.type = 'file';
        this.fileButtonEl.multiple = true;
        this.fileButtonEl.style.position = 'absolute';
        this.fileButtonEl.onchange = () => {
            // console.log('value', this.fileButtonEl.files);
            // uploadFile(this.fileButtonEl.files[0], '976635531627', '1656449899651_s24afy3nw7');
            addComment('976635531627', '1231231', 124, 'hello world', this.fileButtonEl.files).then(comment => {
                console.log('new comment', comment);
            });
        };
        console.log('this.fileButtonEl ', this.fileButtonEl);

        this.lowerLights();
        this.fetchComments();
    }

    /**
     * [destructor]
     *
     * @override
     * @return {void}
     */
    destroy() {
        if (this.mediaEl) {
            this.mediaEl.removeEventListener('mousemove', this.mousemoveHandler);
            this.mediaEl.removeEventListener('click', this.pointerHandler);
            this.mediaEl.removeEventListener('touchstart', this.pointerHandler);
            this.mediaEl.removeEventListener('waiting', this.waitingHandler);
        }

        if (this.playButtonEl) {
            this.playButtonEl.removeEventListener('click', this.togglePlay);
        }

        super.destroy();
    }

    /**
     * Handler for meta data load for the media element.
     *
     * @override
     * @return {void}
     */
    loadeddataHandler() {
        super.loadeddataHandler();
        this.showPlayButton();

        if (this.mediaControls) {
            this.mediaControls.show();
        } else if (this.controls && this.controls.controlsLayer) {
            this.controls.controlsLayer.show();
            this.controls.controlsLayer.hide(); // Show controls briefly after content loads
        }
    }

    /**
     * @inheritdoc
     */
    loadUI() {
        super.loadUI();
        this.fetchComments();
    }

    /**
     * @inheritdoc
     */
    loadUIReact() {
        super.loadUIReact();

        this.controls = new ControlsRoot({
            className: 'bp-VideoControlsRoot',
            containerEl: this.mediaContainerEl,
            fileId: this.options.file.id,
            onHide: this.handleControlsHide,
            onShow: this.handleControlsShow,
        });
        this.renderUI();
    }

    /**
     * Handler for a pointer event on the media element.
     *
     * @param  {Event} event pointer event, either touch or mouse
     * @return {void}
     */
    pointerHandler(event) {
        if (event.type === 'touchstart') {
            // Prevents 'click' event from firing which would pause the video
            event.preventDefault();
            event.stopPropagation();

            if (this.mediaControls) {
                this.mediaControls.toggle();
            }
        } else if (event.type === 'click') {
            this.togglePlay();
        }
    }

    /**
     * Handler for play state
     *
     * @override
     * @return {void}
     */
    playingHandler() {
        super.playingHandler();
        this.hidePlayButton();
    }

    /**
     * Handler for pause state
     *
     * @override
     * @return {void}
     */
    pauseHandler() {
        super.pauseHandler();
        this.showPlayButton();
        this.hideLoadingIcon();
    }

    /**
     * Shows the loading indicator.
     *
     * @private
     * @return {void}
     */
    waitingHandler() {
        if (this.containerEl) {
            this.containerEl.classList.add(CLASS_IS_BUFFERING);
            this.hidePlayButton();
        }
    }

    /**
     * Adds event listeners to the media controls.
     * Makes changes to the media element.
     *
     * @override
     * @return {void}
     */
    addEventListenersForMediaControls() {
        super.addEventListenersForMediaControls();

        /* istanbul ignore next */
        this.mediaControls.on('togglefullscreen', () => {
            this.toggleFullscreen();
        });
    }

    /**
     * Adds event listeners to the media element.
     * Makes changes to the media controls.
     *
     * @override
     * @return {void}
     */
    addEventListenersForMediaElement() {
        super.addEventListenersForMediaElement();

        /* istanbul ignore next */
        this.mousemoveHandler = throttle(() => {
            if (this.mediaControls) {
                this.mediaControls.show();
            }
        }, MOUSE_MOVE_TIMEOUT_IN_MILLIS);

        this.mediaEl.addEventListener('mousemove', this.mousemoveHandler);

        if (this.hasTouch) {
            this.mediaEl.addEventListener('touchstart', this.pointerHandler);
        }

        this.mediaEl.addEventListener('click', this.pointerHandler);
        this.mediaEl.addEventListener('waiting', this.waitingHandler);
        this.playButtonEl.addEventListener('click', this.togglePlay);
    }

    /**
     * @inheritdoc
     */
    showLoadingIcon() {
        super.showLoadingIcon();
    }

    /**
     * Overriden method to handle resizing of the window.
     * Adjusts the size of the time scrubber since its
     * senstive to the containers width.
     *
     * @override
     * @return {void}
     */
    resize() {
        if (this.mediaControls) {
            this.mediaControls.resizeTimeScrubber();
        }
        super.resize();
    }

    /**
     * Function to tell preview if navigation arrows
     * should be shown and won't intefere with viewer
     *
     * @protected
     * @return {boolean} true if arrows should be shown
     */
    allowNavigationArrows() {
        return !this.mediaControls || !this.mediaControls.isSettingsVisible();
    }

    /**
     * Darkens the background of preview.
     * Good for having high contrast videos.
     *
     * @protected
     * @return {void}
     */
    lowerLights() {
        if (this.rootEl) {
            this.rootEl.classList.add(CLASS_DARK);
        }
    }

    /**
     * @inheritdoc
     */
    onKeydown(key) {
        return super.onKeydown(key);
    }

    /**
     * Auto-play was prevented, try muted play
     *
     * @override
     */
    handleAutoplayFail = () => {
        this.setVolume(0);
        this.play().catch(this.pause);
    };

    handleControlsHide = () => {
        this.mediaContainerEl.classList.remove('bp-media-controls-is-visible');
    };

    handleControlsShow = () => {
        this.mediaContainerEl.classList.add('bp-media-controls-is-visible');
    };

    fetchComments() {
        getComments('977307283157').then(comments => {
            if (comments && this.mediaControls) {
                this.comments = comments;
                this.mediaControls.addCommentsToVidScrubber(comments);
            }
        });
    }
}

export default VideoBaseViewer;
