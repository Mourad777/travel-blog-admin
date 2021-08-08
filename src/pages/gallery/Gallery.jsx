import React from "react";
import Gallery from "react-photo-gallery";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import GalleryItem from './GalleryItem'

const SortablePhoto = SortableElement(item => <GalleryItem {...item} />);
const SortableGallery = SortableContainer(({ items, handleDetails, handleDelete }) => (
    <Gallery photos={items} renderImage={props => (
        <SortablePhoto handleDetails={handleDetails} handleDelete={handleDelete} {...props} />
    )} />
));

export default SortableGallery;