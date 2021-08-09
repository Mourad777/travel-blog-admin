import axios from 'axios'
import { AppUrl } from './utility'
import { processComments } from './helper-functions'

// const token = document.head.querySelector('meta[name="csrf-token"]');
const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
console.log('token',token.content)
const defaultPostHeader = {
    headers: {
        'Content-Type': 'multipart/form-data',
        "X-CSRF-TOKEN'": token
    }
}
//comments api
export const getComments = async (docId, docType, setComments, setIsLoading) => {
    setIsLoading(true)
    let res;
    try {
        res = await axios.get(`${AppUrl}api/comments/${docType}/${docId}`);
    } catch (e) {
        setIsLoading(false)
        console.log('Fetch comments response error', res);
    }
    console.log('Fetch comments response', res)
    const comments = res.data;
    setComments(processComments(comments));
    setIsLoading(false)
}

export const getDocument = async (docId, docType, setDocument, setIsLoading) => {
    setIsLoading(true)
    let res;
    try {
        res = await axios.get(`${AppUrl}api/${docType}s/${docId}`);
    } catch (e) {
        console.log('Respost fetch post or video', res)
        setIsLoading(false)
    }
    console.log('Respost fetch post or video', res)
    const doc = res.data;
    setDocument(doc);
    setIsLoading(false)

}

export const toggleCommentApproval = async (id, setIsLoading) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('comment_id', id)
    let toggleCommentAprrovalResponse;
    try {
        toggleCommentAprrovalResponse = await axios.post(`${AppUrl}api/comments/approve-comment`, formData, defaultPostHeader)

    } catch (e) {
        console.log('Toggle Comment Aprroval Response Error', e)
        setIsLoading(false)
    }
    console.log('Toggle Comment Aprroval Response', toggleCommentAprrovalResponse)
    setIsLoading(false);
}

//countries api

export const getCountryThumbnails = async (setCountryThumbnails, setIsLoading) => {
    setIsLoading(true)
    let fetchCountryThumbnailsResponse;
    try {
        fetchCountryThumbnailsResponse = await axios.get(`${AppUrl}api/countries`);
    } catch (e) {
        console.log('Fetch Country Thumbnails Error', e);
        setIsLoading(false)
    }
    setIsLoading(false)
    console.log('Fetch Country Thumbnails Response', fetchCountryThumbnailsResponse);
    setCountryThumbnails(fetchCountryThumbnailsResponse.data);
}

export const uploadCountryThumbnail = async (formData, setIsLoading) => {
    setIsLoading(true);
    let uploadThumbnailResponse;
    try {
        uploadThumbnailResponse = await axios.post(
            `${AppUrl}api/countries/save`,
            formData,
            defaultPostHeader
        );
    } catch (e) {
        console.log('Upload Country Thumbnail Error', e);
        setIsLoading(false);
    }
    console.log('Upload Country Thumbnail Response', uploadThumbnailResponse);
    setIsLoading(false);
}

export const updateCountryThumbnail = async (id, formData, setIsLoading) => {
    setIsLoading(true);
    let updateThumbnailResponse;
    try {
        updateThumbnailResponse = await axios.post(
            `${AppUrl}api/countries/update/${id}`,
            formData,
            defaultPostHeader
        );
    } catch (e) {
        console.log('Update Country Thumbnail Error', e);
        setIsLoading(false);
    }
    console.log('Update Country Thumbnail Response', updateThumbnailResponse);
    setIsLoading(false);
}

export const deleteCountryThumbnail = async (id, setIsLoading) => {
    setIsLoading(true);
    let deleteCountryThumbnailsResponse;
    try {
        deleteCountryThumbnailsResponse = await axios.delete(`${AppUrl}api/countries/delete/${id}`);
        console.log('Delete Country Thumbnails Response', deleteCountryThumbnailsResponse)
    } catch (e) {
        console.log('Delete Country Thumbnail Error', e);
        setIsLoading(false);
    }
    console.log('Delete Country Thumbnail Response', deleteCountryThumbnailsResponse);
    setIsLoading(false);
}

//categories api
export const getCategories = async () => {
    let categoriesResponse;
    try {
        categoriesResponse = await axios.get(`${AppUrl}api/categories`);
    } catch (e) {
        console.log('Fetch categories response error', e)
    }
    console.log('Fetch categories response', categoriesResponse)
    return categoriesResponse;
}

export const submitNewCategory = async (newCategory, setIsLoading) => {
    const formData = new FormData();
    formData.append('name', newCategory);
    let newCategoryResponse;
    setIsLoading(true)
    try {
        newCategoryResponse = await axios.post(
            `${AppUrl}api/categories/save`,
            formData,
            defaultPostHeader
        )
    } catch (e) {
        setIsLoading(false)
        console.log('New category response error: ', e)
    }
    console.log('New category response: ', newCategoryResponse)
}

export const getCategoryContent = async (countryIso, selectedCategory, setPosts, setPhotos, setVideos) => {
    let url;
    if (countryIso) {
        url = `${AppUrl}api/countries/${countryIso}`;
    }
    if (selectedCategory) {
        url = `${AppUrl}api/categories/${selectedCategory}`
    }
    let contentResponse;
    try {
        contentResponse = await axios.get(url);
    } catch (e) {
        console.log('Content response error', e)
    }
    console.log('content response', contentResponse)
    setPosts(contentResponse.data.posts || []);
    setPhotos(contentResponse.data.photos || []);
    setVideos(contentResponse.data.videos || []);
}

//updates the order of photos or videos in a gallery after
//dragging and dropping
export const updateOrder = async (items, galleryType) => {
    const updateOrderUrl = `${AppUrl}api/configurations/update`;
    const order = items.map(item => item.id);
    const configFormData = new FormData();
    configFormData.append(galleryType, JSON.stringify(order));
    let resUpdateOrder;
    try {
        resUpdateOrder = await axios.post(
            updateOrderUrl,
            configFormData,
            defaultPostHeader
        );
    } catch (e) {
        console.log('Update photo order response error: ', e)

    }
    console.log('Update photo order response: ', resUpdateOrder)
}

export const getPhotos = async (setItems, setIsLoading) => {
    const fetchPhotosUrl = `${AppUrl}api/photos`;
    let resFetchPhotos;
    setIsLoading(true);
    try {
        resFetchPhotos = await axios.get(fetchPhotosUrl);

    } catch (e) {
        console.log('Fetch photos response error', e);

        setIsLoading(false)
    }

    console.log('Fetch photos response', resFetchPhotos);

    const fetchConfigUrl = `${AppUrl}api/configurations`;
    let resFetchConfigurations;
    try {
        resFetchConfigurations = await axios.get(fetchConfigUrl);

    } catch (e) {
        console.log('Fetch configuration response error', e);

        setIsLoading(false)
    }

    console.log('Fetch config response', resFetchConfigurations);

    setIsLoading(false)
    const formattedPhotos = resFetchPhotos.data.map(item => {
        return {
            ...item,
            src: item.src,
            height: 1,
            width: 1.5,
            id: item.id,
        }
    });

    if (resFetchConfigurations.data !== 'no_config') {
        const order = JSON.parse(resFetchConfigurations.data.photo_gallery_order);
        const orderedFormattedPhotos = [];
        order.forEach(number => {
            formattedPhotos.forEach(photo => {
                if (photo.id === number) {
                    orderedFormattedPhotos.push(photo);
                }
            })
        });
        setItems(orderedFormattedPhotos)
    } else {
        setItems(formattedPhotos)
    }
}

export const updatePhotoDetails = async (id, formData, setIsLoading) => {
    setIsLoading(true);
    let updatePhotoDetailsResponse;
    try {
        updatePhotoDetailsResponse = await axios.post(
            `${AppUrl}api/photos/update/${id}`,
            formData,
            defaultPostHeader);
    } catch (e) {
        setIsLoading(false);
        console.log('Update photo details response error', e)
    }
    console.log('Update photo details response', updatePhotoDetailsResponse)

    setIsLoading(false);
}

export const updateVideoDetails = async (id, formData, setIsLoading) => {
    setIsLoading(true);
    let updateVideoDetailsResponse;
    try {
        updateVideoDetailsResponse = await axios.post(
            `${AppUrl}api/videos/update/${id}`,
            formData,
            defaultPostHeader
        );
    } catch (e) {
        setIsLoading(false);
        console.log('Update Video Details Error', e)
    }
    setIsLoading(false);
    console.log('Update Video Details Response', updateVideoDetailsResponse);
}

export const getVideos = async (setItems, setIsLoading) => {
    const fetchVideosUrl = `${AppUrl}api/videos`;
    setIsLoading(true);
    let resFetchVideos;
    try {
        resFetchVideos = await axios.get(fetchVideosUrl);
    } catch (e) {
        console.log('Fetch videos response error', e);
        setIsLoading(false)
    }

    console.log('Fetch videos response', resFetchVideos);

    const fetchConfigUrl = `${AppUrl}api/configurations`;
    let resFetchConfigurations;
    try {
        resFetchConfigurations = await axios.get(fetchConfigUrl);
    } catch (e) {
        console.log('Fetch configuration response error', e);
        setIsLoading(false)
    }
    console.log('Fetch config response', resFetchConfigurations);

    setIsLoading(false)
    const formattedVideos = resFetchVideos.data.map(item => {
        return {
            ...item,
            src: item.thumbnail || '/assets/icons/video-icon.jpg',
            height: 1,
            width: 1.5,
            commentCount: item.comment_count,
            id: item.id,
            videoUrl: item.src
        }
    });

    if (resFetchConfigurations.data !== 'no_config') {
        const order = JSON.parse(resFetchConfigurations.data.video_gallery_order);
        const orderedFormattedVideos = [];
        order.forEach(number => {
            formattedVideos.forEach(video => {
                if (video.id === number) {
                    orderedFormattedVideos.push(video);
                }
            })
        });
        setItems(orderedFormattedVideos)
    } else {
        setItems(formattedVideos)
    }
}

export const getVideo = async (id, setVideo, setIsLoading) => {
    setIsLoading(true);
    let videoResponse;
    try {
        videoResponse = await axios.get(`${AppUrl}api/videos/${id}`);
    } catch (e) {
        console.log('Fetch Video Error', e)
        setIsLoading(false)
    }
    console.log('Fetch Video Response', videoResponse);
    setVideo(videoResponse.data);
    setIsLoading(false);
}

export const deleteVideo = async (id, setIsLoading) => {
    let deleteVideoResponse;
    setIsLoading(true);
    try {
        deleteVideoResponse = await axios.delete(`${AppUrl}api/videos/delete/${id}`, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    } catch (e) {
        setIsLoading(false);
        console.log('Delete video response error', e)
    }
    setIsLoading(false);
    console.log('Delete video response', deleteVideoResponse)
}

export const deletePhoto = async (id, setIsLoading) => {
    let deletePhotoResponse;
    setIsLoading(true);
    try {
        deletePhotoResponse = await axios.delete(`${AppUrl}api/photos/delete/${id}`, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    } catch (e) {
        setIsLoading(false);
        console.log('Delete photo response error', e)
    }
    setIsLoading(false);
    console.log('Delete photo response', deletePhotoResponse)
}

export const uploadPhoto = async (formData, items, setIsLoading) => {

    const savePhotoUrl = `${AppUrl}api/photos/save`;
    setIsLoading(true)
    let resUploadPhoto;
    try {
        resUploadPhoto = await axios.post(
            savePhotoUrl,
            formData,
            defaultPostHeader
        );
    } catch (e) {
        setIsLoading(false)
        console.log('Upload photo response error', e)
    }
    console.log('Upload photo response', resUploadPhoto)

    setIsLoading(false)
    return [{ ...resUploadPhoto.data, src: resUploadPhoto.data.src, height: 1, width: 1.5, id: resUploadPhoto.data.id }, ...items];
}

export const presignedUrlFileUpload = async (filename, directory, file, saveModelUrl, modelData) => {
    //step 1 get presigned url
    const presignedUrlEndpoint = `${AppUrl}api/upload/store`;
    const fileInfo = new FormData();
    fileInfo.append('filename', filename);
    fileInfo.append('directory', directory);

    const resPresignedUrl = await axios.post(
        presignedUrlEndpoint,
        fileInfo,
        defaultPostHeader
    );
    console.log('Presigned url response', resPresignedUrl);

    //step 2 send file to presigned url
    const fileData = new FormData();
    const inputs = resPresignedUrl.data.inputs;
    Object.keys(inputs).forEach(key => {
        fileData.append(key, inputs[key]);
    });

    fileData.append('file', file);

    const fileUploadUrl =
        resPresignedUrl.data.attributes.action;
    //this request goes to aws directly from front-end
    const response = await axios.post(
        fileUploadUrl,
        fileData,
    );
    console.log('file upload response', response);

    //step 3 save key and any additional data in appropriate model
    const newModelFormData = new FormData();
    modelData.forEach(item => {
        newModelFormData.append(item.key, item.value)
    });

    const saveModelResponse = await axios.post(
        saveModelUrl, newModelFormData,
        defaultPostHeader
    );
    console.log('Save model response', saveModelResponse)
    return { videoUrl: resPresignedUrl.data.url, videoId: saveModelResponse.data.id }
}

export const deleteCategory = async (id, setIsLoading) => {
    let deleteResponse;
    setIsLoading(true);
    try {
        deleteResponse = await axios.delete(`${AppUrl}api/categories/delete/${id}`, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    } catch (e) {
        console.log('Delete Error Response', e)
        setIsLoading(false);
    }
    console.log('Delete Response', deleteResponse);
}

//posts api
export const getPosts = async (setPosts, setIsLoading) => {
    let res;
    setIsLoading(true)
    try {
        res = await axios.get(`${AppUrl}api/posts`);

    } catch (e) {
        console.log('Fetch posts error', e)
        setIsLoading(false)
    }
    console.log('Fetch posts response', res)
    const posts = res.data;
    setPosts(posts);
    setIsLoading(false)
}

export const initializePostForm = async (id, setIsLoading) => {
    let res;
    setIsLoading(true)
    try {
        res = await axios.get(`${AppUrl}api/posts/edit/${id}`);

    } catch (e) {
        console.log('Fetch post error', e)
        setIsLoading(false)
    }
    setIsLoading(false)
    console.log('Fetch post response', res)
    return res.data;
}

export const updatePostForm = async (url, formData, setIsLoading) => {
    let res;
    setIsLoading(true)
    try {
        res = await axios.post(
            url,
            formData,
            defaultPostHeader
        );

    } catch (e) {
        console.log('Update post error', e)
        setIsLoading(false)
    }
    setIsLoading(false)
    console.log('Update post response', res)
}

export const deletePost = async (id, setIsLoading) => {
    let res;
    setIsLoading(true)
    try {
        res = await axios.delete(`${AppUrl}api/posts/delete/${id}`, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

    } catch (e) {
        console.log('Fetch posts error', e)
        setIsLoading(false)
    }
    setIsLoading(false)
    console.log('Fetch posts response', res)
}

//messages api

export const getMessages = async (setMessages, setIsLoading) => {
    setIsLoading(true)
    let res;
    try {
        res = await axios.get(`${AppUrl}api/messages`);
    } catch (e) {
        console.log('Messages response error: ', e);
        setIsLoading(false)
    }
    setIsLoading(false)
    console.log('Fetch messages response', res)
    const messages = res.data;
    setMessages(messages);
}


export const getMessage = async (messageId, setMessage, setIsLoading) => {
    setIsLoading(true)
    let res;
    try {
        res = await axios.get(`${AppUrl}api/message/${messageId}`);
    } catch (e) {
        console.log('Message response error: ', e);
        setIsLoading(false)
    }
    setIsLoading(false)
    console.log('Fetch message response', res)
    const message = res.data;
    setMessage(message);
}


//tinymce editor
export const editor_photo_upload_handler = async (blobInfo, success, failure, progress) => {
    const formData = new FormData();
    formData.append('image', blobInfo.blob());
    const res = await axios.post(
        `${AppUrl}api/tinymce/upload`,
        formData,
        defaultPostHeader
    );

    console.log('res.data', res.data)
    success(res.data.location)
    return res.data.location;
};