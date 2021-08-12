import React from "react";
import { useHistory } from "react-router-dom";
import { StyledBlueButton, StyledRedButton } from "../../StyledComponents";

const imgWithClick = { cursor: "pointer" };
//commentCount
const Photo = ({ index, onClick, photo, margin, direction, top, left, handleDetails, handleDelete, galleryType }) => {
  const history = useHistory()
  const imgStyle = { margin: margin, padding: 10, objectFit: 'cover', width: 300, height: 300 };
  if (direction === "column") {
    imgStyle.position = "absolute";
    imgStyle.left = left;
    imgStyle.top = top;
    imgStyle.objectFit = 'cover';
  }

  const handleClick = event => {
    onClick(event, { photo, index });
  };


  return (
    <div key={`${galleryType === 'video' ? 'video' : 'photo'}[${photo.id}]`} style={{ display: 'flex', flexDirection: 'column', maxHeight: 400 }}>
      <img
        style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle}
        src={!isNaN(photo.src) ? '/assets/icons/video-icon.jpg' : photo.src}
        onClick={onClick ? handleClick : null}
        alt="img"
      />
      {/* the react photo gallery uses the src prop as the key and must be unique or else 
      an extra gallery item gets added when rearranging, for the video gallery a custom thumbnail
      is optional and a video icon is used as a backup but many gallery items can use that video icon
      and will have the same key since its the same url, so to get around this issue a random number will
      be generated and a check will be made if the src prop is a number if so the video icon should be used
      */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
        <StyledBlueButton style={{ width: '100%' }} onClick={() => handleDetails(photo)}
        >
          Details
        </StyledBlueButton>
        {galleryType === 'video' && <StyledBlueButton style={{ width: '100%' }} onClick={() => history.push(`/video/${photo.id}/comments`)}
        >
          Comments {photo.commentCount}
        </StyledBlueButton>}
        <StyledRedButton style={{ maxWidth: 100, }} onClick={() => handleDelete(photo.id)}
        >
          Delete
          {/* <i className="trash icon" onClick={() => handleDeleteVideo(photo.id)}></i> */}
        </StyledRedButton>
      </div>
    </div>
  );
};

export default Photo;