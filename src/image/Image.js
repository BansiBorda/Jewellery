import React from 'react';

// Import all your images here
import neckImage from '../../assets/images/neck.jpg';
import ringImage from '../../assets/images/slider2.jpg';
import braceletImage from '../../assets/images/slider3.jpg';

const images = {
    'neck.jpg': neckImage,
    'slider2.jpg': ringImage,
    'slider3.jpg': braceletImage,
};

const getImage = (imageName) => {
    return images[imageName] || null;
};

export default { getImage };
