import { useEffect, useState } from "react";
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
  } from 'react-image-crop'
  import 'react-image-crop/dist/ReactCrop.css'

export default function Cropper() {
    const [crop, setCrop] = useState()
    const [img, setImg] = useState()
    const [result, setResult] = useState()

    useEffect(()=> {
        crop && imageCropping()
    }, [crop])

    const imageLoading = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader();

        reader.onload = function(event) {
          const img = document.createElement('img');
          img.src = event.target.result;
          setImg(img.src);
        };

        reader.readAsDataURL(file);
    }

    const imageCropping = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');

        const imageElement = document.createElement('img');
        imageElement.src = img;

        imageElement.onload = () => {
            ctx.drawImage(imageElement, crop.x / imageElement , crop.y, crop.width, crop.height, 0, 0, 400, 400);
            const croppedImage = canvas.toDataURL();
            setResult(croppedImage);
          };
    }

  return (
    <>
      <h1>Cropper</h1>
      <input type="file" id="myFileInput" accept="image/*" onChange={imageLoading}/>
      <ReactCrop crop={crop} onChange={c => setCrop(c)}>
      <img width ="200px" height="200px" src={img} />
      <img width="300px"  height="300px" src={result} />
    </ReactCrop>
    </>
  );
}
