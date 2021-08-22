import React, { useState, createRef, useEffect, Fragment } from "react";
import arrayMove from "array-move";
import {
    StyledBlueButton,
    StyledFormTextInput,
    StyledRedButton,
    StyledSubmitButton,
    StyledThumbnailPreview,
} from '../../StyledComponents';
import { AppUrl, getFileName, getPusher } from '../../utility/utility';
import { Checkbox, Segment, Dropdown } from 'semantic-ui-react'
import { countries } from "../../utility/countries-iso";
import TagInput from "../../components/TagInput/TagInput";
import ReactPlayer from 'react-player'
import SortableGallery from '../gallery/Gallery'
import { deleteVideo, getCategories, getVideos, submitNewCategory, updateOrder, presignedUrlFileUpload, updateVideoDetails } from "../../utility/api";
import { processCategories } from "../../utility/helper-functions";
import Loader from "../../components/Loader/Loader";

function VideoGallery() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(false);

    const [title, setTitle] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [isCommentsEnabled, setIsCommentsEnabled] = useState(true);

    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [country, setCountry] = useState('');

    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [newCategory, setNewCategory] = useState([]);

    const videoFileInputRef = createRef();
    const thumbnailInputRef = createRef();

    const onSortEnd = async ({ oldIndex, newIndex }) => {
        const reArrangeVideos = arrayMove(items, oldIndex, newIndex);
        console.log('reArrangeVideos', reArrangeVideos)
        setItems(reArrangeVideos);
        updateOrder(reArrangeVideos, 'video_gallery_order')
    };

    const getInitialData = async () => {
        setIsLoading(true);
        const categoriesResponse = await getCategories() || {};
        const processedCategories = processCategories(categoriesResponse.data || []);
        setCategories(processedCategories);

        await getVideos(setItems, setIsLoading)
    }

    useEffect(() => {
        getInitialData()

        const channel = getPusher().subscribe("my-channel");
        channel.bind("CommentsUpdated", async (data) => {
            console.log('data', data)
            getInitialData()
        });
    }, []);

    const handleVideoUpload = async e => {
        e.preventDefault()
        const file = e.target.files[0];
        const saveModelUrl = `${AppUrl}api/videos/save`;
        setIsLoading(true);
        const filename = getFileName(file.name);
        const directory = 'videos';
        const modelData = [{ key: 'key', value: `${directory}/${filename}` }];
        const { videoUrl, videoId } = await presignedUrlFileUpload(filename, directory, file, saveModelUrl, modelData);
        setIsLoading(false);

        const newArray = [
            {
                videoUrl: videoUrl,
                src: '/assets/icons/video-icon.jpg',
                height: 1,
                width: 1.5,
                id: videoId,
                is_comments_enabled: '1',
            },
            ...items
        ].map((item, i) => ({ ...item, key: `video[${i + 1}]` }));
        setItems(newArray);
        updateOrder(newArray, 'video_gallery_order');
        handleVideoDetails(newArray[0])
    };

    const handleVideoDetails = (video) => {
        setTitle(video.title || '')
        setThumbnail(video.thumbnail)
        setDescription(video.description || '')
        setTags(Array.isArray(JSON.parse(video.tags ? video.tags : '""')) ? JSON.parse(video.tags) : [])
        setSelectedCategories((video.categories || []).map(cat => cat.name));
        setCountry(video.country)
        setSelectedVideo(video)
        setIsCommentsEnabled(!!parseInt(video.is_comments_enabled));

    }

    const submitVideoDetails = async (video) => {
        const selectedCategoriesIds = categories.filter(cat => selectedCategories.includes(cat.text)).map(cat => cat._id);
        const formData = new FormData();
        if (!!thumbnail) {
            if (thumbnail instanceof File) {
                //this will be an updated image
                const compressedFile = await resizeImageFn(thumbnail);
                formData.append('thumbnail', compressedFile);
            } else {
                //this will be the unchanged image
                formData.append('thumbnail', 'sameThumbnail');
            }
        }
        formData.append('title', title || '');
        formData.append('description', description || '');
        formData.append('is_comments_enabled', isCommentsEnabled ? 1 : 0);
        formData.append('tags', JSON.stringify(tags));
        formData.append('country', country || '');
        formData.append('selected_categories', JSON.stringify(selectedCategoriesIds));

        await updateVideoDetails(selectedVideo.id, formData, setIsLoading);
        setSelectedVideo(null);
        await getVideos(setItems, setIsLoading);
    }

    const handleSelectedCategories = (e, { label, checked }) => {
        if (checked) {
            setSelectedCategories([...selectedCategories, label]);
        } else {
            setSelectedCategories(selectedCategories.filter(el => el !== label));
        }
    };

    const submitCategory = async () => {
        await submitNewCategory(newCategory, setIsLoading)
        const categoriesResponse = await getCategories();
        const processedCategories = processCategories(categoriesResponse.data);
        setCategories(processedCategories);
        setNewCategory('')
    }

    const handleDeleteVideo = async (id) => {
        await deleteVideo(id, setIsLoading);
        const newArray = items.filter(p => p.id !== id);
        updateOrder(newArray, 'video_gallery_order')
        setItems(newArray);
    }
    const handleThumbnailChange = e => {
        e.preventDefault()
        setThumbnail(e.target.files[0]);
    };

    const handleComments = () => {
        setIsCommentsEnabled(!isCommentsEnabled);
    }

    return (
        <div>
            {isLoading && <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}
            <h1 style={{ textAlign: 'center' }}>Video Gallery</h1>
            {selectedVideo ?
                <div style={{ maxWidth: 500, margin: 'auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        {/* <img style={{ maxWidth: 500, width: '100%' }} src={selectedVideo.src} /> */}
                        <ReactPlayer
                            controls
                            width="100%"
                            height="100%" url={selectedVideo.videoUrl} />
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <StyledThumbnailPreview file={thumbnail instanceof File ? URL.createObjectURL(thumbnail) : thumbnail} />
                    </div>
                    <div style={{ margin: '20px 0' }}>
                        <StyledBlueButton onClick={() => thumbnailInputRef.current.click()} icon="image">
                            Upload Thumbnail
                        </StyledBlueButton>
                        <StyledRedButton onClick={() => setThumbnail(null)}
                        >
                            <i className="trash icon"></i>
                        </StyledRedButton>
                        <input
                            ref={thumbnailInputRef}
                            type="file"
                            hidden
                            onChange={handleThumbnailChange}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '1.2em' }}>Title</label>
                        <StyledFormTextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Title' />
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <label style={{ fontSize: '1.2em' }}>Description</label>
                        <StyledFormTextInput value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Description' />
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <label style={{ fontSize: '1.2em' }}>Tags</label>
                        <TagInput values={tags} onChange={(value) => setTags(value)} />
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <label style={{ fontSize: '1.2em' }}>Create a new category</label>
                        <StyledFormTextInput value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder='New Category' />
                        <div style={{ marginTop: 10 }}>
                            <StyledBlueButton disabled={!newCategory} onClick={submitCategory} icon="image"
                            >
                                Create Category
                            </StyledBlueButton>
                        </div>
                    </div>
                    <Segment basic>
                        <p>Categories: {selectedCategories.length > 0 ? selectedCategories.join(", ") : "empty"}</p>

                        <Dropdown item simple text="Select categories">
                            <Dropdown.Menu>
                                {categories.map(cat => {

                                    return (
                                        <Dropdown.Item key={cat._id}>
                                            <Checkbox label={cat.text} checked={selectedCategories.includes(cat.text)} onChange={handleSelectedCategories} />
                                        </Dropdown.Item>
                                    )
                                })}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Segment>
                    <div style={{ marginTop: 20 }}>
                        <label style={{ fontSize: '1.2em' }}>Country</label>
                        <Dropdown
                            clearable
                            placeholder='Select Country'
                            fluid
                            search
                            selection
                            options={countries}
                            onChange={(e, { value }) => setCountry(value)}
                            value={country}
                        >

                        </Dropdown>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: 200, padding: 20, fontSize: '1.2em' }}><span style={{ marginRight: 10 }}>Comments Enabled</span>
                        <Checkbox checked={!!isCommentsEnabled} onChange={() => handleComments()} /></div>
                    <div style={{ display: 'flex', marginTop: 20 }}>
                        <StyledSubmitButton onClick={() => submitVideoDetails()} icon="image">
                            Update
                        </StyledSubmitButton>
                        <StyledRedButton style={{ maxWidth: 100, }} onClick={() => setSelectedVideo(null)}
                        >
                            Cancel
                        </StyledRedButton>
                    </div>
                </div>
                : (
                    <Fragment>
                        <div style={{ marginTop: 20 }}>
                            <StyledBlueButton onClick={() => videoFileInputRef.current.click()} icon="image">
                                Upload Video
                            </StyledBlueButton>
                            <input
                                ref={videoFileInputRef}
                                type="file"
                                hidden
                                onChange={handleVideoUpload}
                            />
                        </div>
                        <SortableGallery
                            handleDetails={handleVideoDetails}
                            handleDelete={handleDeleteVideo}
                            items={items}
                            onSortEnd={onSortEnd}
                            axis={"xy"}
                            galleryType="video"
                        />
                    </Fragment>
                )}
        </div>
    );
}

export default VideoGallery;