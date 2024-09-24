import {useEffect, useRef} from 'react';

const UploadWidget =()=>{
    const cloudinaryRef = useRef();
    useEffect(()=>{
        cloudinaryRef.current = window.cloudinary.createUploadWidget({
            cloudName: 'dxipaqfep',
            uploadPreset: 'zxis1bvp',
        }, (error, result) => {
            if (!error && result && result.event === 'success') {
                console.log('Done! Here is the image info: ', result.info);
            }
        });
    }, []);

}

export default UploadWidget;