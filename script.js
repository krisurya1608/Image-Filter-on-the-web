// Initialize global variable for initial image. 
let initialImage = null;

function uploadImage() {
    // Draw initial image to canvas and show its size.
    initialImage = new SimpleImage(document.getElementById('image'));
    initialImage.drawTo(document.getElementById('canvas'));
}

function showImageSize(width, height) {
    // Show an image size.
    document.getElementById("size").innerHTML = `Size: ${width}px x ${height}px`;
}

function imageIsLoaded(image) {
    // Check if an image is loaded and display its size.
    if (image && image.complete()) {
        showImageSize(initialImage.getWidth(), initialImage.getHeight());
        return true;
    }
    window.alert('No image has been uploaded yet.');
    return false;
}

function resetImage() {
    // Draw initial image on canvas.
    if (imageIsLoaded(initialImage)) {
        initialImage.drawTo(document.getElementById('canvas'));
    }
}

function getAvg(pixel) {
    return (pixel.getRed()+pixel.getGreen()+pixel.getBlue()) / 3;
}

function setNewRGBl(pixel, avg, pixelR, pixelG, pixelB) {
    // Set new RGB to a pixel.
    pixel.setRed(calculateRGBForFilters(avg, pixelR));
    pixel.setGreen(calculateRGBForFilters(avg, pixelG));
    pixel.setBlue(calculateRGBForFilters(avg, pixelB));
}

function grayscaleFilter() {
    // Helper function for the doGray() function which contains filter algorithm.
    let grayscaleImage = new SimpleImage(initialImage.getWidth(), initialImage.getHeight());
    for (let pixel of initialImage.values()) {
        let avg = getAvg(pixel);
        let targetPixel = grayscaleImage.getPixel(pixel.getX(), pixel.getY());
        setNewRGBl(targetPixel, avg, avg, avg, avg);
    }
    return grayscaleImage;
}

function doGray() {
    // Apply grayscale filter on an image and draw it on canvas.
    if (!imageIsLoaded(initialImage)) {
        return null;
    }
    let resultImage = grayscaleFilter();
    resultImage.drawTo(document.getElementById('canvas'));
}

function redFilter() {
    // Helper function for the doRed() function which contains filter algorithm.
    let redImage = new SimpleImage(initialImage.getWidth(), initialImage.getHeight());
    for (let pixel of initialImage.values()) {
        let avg = getAvg(pixel);
        let targetPixel = redImage.getPixel(pixel.getX(), pixel.getY());
        if (avg < 128) {
            setNewRGBl(targetPixel, avg, 2*avg, 0, 0);
        } else {
            setNewRGBl(targetPixel, avg, 255, 2*avg - 255, 2*avg - 255);
        }
    }
    return redImage;
}

function doRed() {
    // Apply red filter on an image and draw it on canvas.
    if (!imageIsLoaded(initialImage)) {
        return null;
    }
    let resultImage = redFilter();
    resultImage.drawTo(document.getElementById('canvas'));
}

function calculateRGBForFilters(avg, color) {
    /**
     * Color algorithm where each color:
     * Color = Cc/127.5*avg                      for avg < 128
     * Color = (2 - Cc/127.5)*avg + 2*Cc - 255   for avg >=128.
     */
    if (avg === color && (color === 0 || color === 255)) {
        return color;
    } else if (avg < 128) {
        return Math.round(color/127.5*avg);
    } else {
        return Math.round((2 - color/127.5)*avg + 2*color - 255);
    }
}

function italyFilter() {
    /**
     * Helper function for the doItaly() function. 
     * Consider Italy flag colors as RGB(0,146,70), RGB(255,255,255) and RGB(206,43,55).
     */
    let resultImage = new SimpleImage(initialImage.getWidth(), initialImage.getHeight());
    let stripeSize = initialImage.getWidth() / 3;
    for (let pixel of initialImage.values()) {
        let pixelX = pixel.getX();
        let avg = getAvg(pixel);
        let targetPixel = resultImage.getPixel(pixelX, pixel.getY());
        if (pixelX < stripeSize){
            // Apply RGB(0,146,70).
            setNewRGBl(targetPixel, avg, 0, 146, 70);
        } else if (pixelX < 2*stripeSize) {
            // Apply RGB(255,255,255).
            setNewRGBl(targetPixel, avg, 255, 255, 255);
        } else {
            // RGB(206,43,55).
            setNewRGBl(targetPixel, avg, 206, 43, 55);
        }
    }
    return resultImage;
}

function doItaly() {
    // Apply Italy flag to an image.
    if (!imageIsLoaded(initialImage)) {
        return null;
    }
    let resultImage = italyFilter();
    resultImage.drawTo(document.getElementById('canvas'));
}

function rainbowFilter() {
    // Rainbow's helper function with color data.
    let resultImage = new SimpleImage(initialImage.getWidth(), initialImage.getHeight());
    let stripeSize = initialImage.getHeight() / 7;
    for (let pixel of initialImage.values()) {
        let pixelY = pixel.getY();
        let avg = getAvg(pixel);
        let targetPixel = resultImage.getPixel(pixel.getX(), pixelY);
        if (pixelY < stripeSize) {
            // Apply red RGB(255,0,0).
            setNewRGBl(targetPixel, avg, 255, 0, 0);
        } else if (pixelY < 2*stripeSize) {
            // Apply orange RGB(255,165,0).
            setNewRGBl(targetPixel, avg, 255, 165, 0);
        } else if (pixelY < 3*stripeSize) {
            // Apply yellow RGB(255,255,0).
            setNewRGBl(targetPixel, avg, 255, 255, 0);
        } else if (pixelY < 4*stripeSize) {
            // Apply green RGB(0,128,0).
            setNewRGBl(targetPixel, avg, 0, 128, 0);
        } else if (pixelY < 5*stripeSize) {
            // Apply blue RGB(0,0,255).
            setNewRGBl(targetPixel, avg, 0, 0, 255);
        } else if (pixelY < 6*stripeSize) {
            // Apply indigo RGB(111,0,255).
            setNewRGBl(targetPixel, avg, 111, 0, 255);
        } else {
            // Apply violet RGB(159,0,255).
            setNewRGBl(targetPixel, avg, 159, 0, 255);
        }
    }
    return resultImage;
}

function doRainbow() {
    // Apply rainbow filter.
    if (!imageIsLoaded(initialImage)) {
        return null;
    }
    let resultImage = rainbowFilter();
    resultImage.drawTo(document.getElementById('canvas'));
}

function blurFilter() {
    // Blur filter algorithm. 
    let intensity = document.getElementById('blur').value;
    let imageWidth = initialImage.getWidth();
    let imageHeight = initialImage.getHeight();
    let resultImage = new SimpleImage(imageWidth, imageHeight);
    const newRandomCoordinate = (currenCoordinate, intensity, maxValue) => {
        let blurValue = currenCoordinate + Math.floor(Math.random() * (2*intensity) - intensity);
        if (blurValue >= 0 && blurValue < maxValue) {
            return blurValue;
        } else {
            return blurValue < 0 ? 0 : maxValue - 1;
        }
    };
    for (let pixel of initialImage.values()) {
        let pixelX = pixel.getX();
        let pixelY = pixel.getY();
        if (Math.random() < 0.5) {
            resultImage.setPixel(pixelX, pixelY, pixel);
        } else {
            resultImage.setPixel(
                pixelX, pixelY,
                initialImage.getPixel(
                    newRandomCoordinate(pixelX, intensity, imageWidth),
                    newRandomCoordinate(pixelY, intensity, imageHeight)
                )
            );
        }

    }
    return resultImage;
}

function doBlur() {
    // Apply blur filer.
    if (!imageIsLoaded(initialImage)) {
        return null;
    }
    let resultImage = blurFilter();
    resultImage.drawTo(document.getElementById('canvas'));
}