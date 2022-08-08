
let functions = (function () {

    const fields = {
        fileInput: document.querySelector(".file-input"),
        filterOptions: document.querySelectorAll(".filter button"),
        filterName: document.querySelector(".filter-info .name"),
        filterValue: document.querySelector(".slider .value"),
        filterSlider: document.querySelector(".slider input"),
        rotateOptions: document.querySelectorAll(".rotate button"),
        previewImg: document.querySelector(".preview-img img"),
        resetFilterBtn: document.querySelector(".reset-filter"),
        chooseImgBtn: document.querySelector(".choose-img"),
        saveImageBtn: document.querySelector(".save-img")
    }

    let filters = {
        brightness: 100,
        saturation: 100,
        inversion: 0,
        grayscale: 0,
        rotate: 0,
        flipHorizontal: 1,
        flipVertical: 1
    }

    function applyFilters() {
        fields.previewImg.style.transform = `rotate(${filters.rotate}deg) scale(${filters.flipHorizontal},${filters.flipVertical})`;
        fields.previewImg.style.filter = `brightness(${filters.brightness}%) saturate(${filters.saturation}%) invert(${filters.inversion}%) grayscale(${filters.grayscale}%)`;
    }

    function loadImage() {
        //debugger;
        let file = fields.fileInput.files[0];
        if (!file) return;
        fields.previewImg.src = URL.createObjectURL(file);
        fields.previewImg.addEventListener("load", () => {
            fields.resetFilterBtn.click();
            document.querySelector(".container").classList.remove("disable");
        });
    }

    function updateFilter() {
        debugger;
        fields.filterValue.innerText = `${fields.filterSlider.value}%`;

        const selectedFilter = document.querySelector(".filter .active");
        if (selectedFilter.id === "brightness") {
            filters.brightness = fields.filterSlider.value;
        } else if (selectedFilter.id === "saturation") {
            filters.saturation = fields.filterSlider.value;
        } else if (selectedFilter.id === "inversion") {
            filters.inversion = fields.filterSlider.value;
        } else {
            filters.grayscale = fields.filterSlider.value;
        }

        applyFilters();
    }

    function resetFilters() {
        debugger;
        filters.brightness = 100;
        filters.saturation = 100;
        filters.inversion = 0;
        filters.grayscale = 0;
        filters.rotate = 0;
        filters.flipHorizontal = 1;
        filters.flipVertical = 1;
        fields.filterOptions[0].click();
        applyFilters();
    }

    function saveImage() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = fields.previewImg.naturalWidth;
        canvas.height = fields.previewImg.naturalHeight;

        ctx.filter = `brightness(${filters.brightness}%) saturate(${filters.saturation}%) invert(${filters.inversion}%) grayscale(${filters.grayscale}%)`;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        if (filters.rotate !== 0) {
            ctx.rotate(filters.rotate * Math.PI / 180);
        }
        ctx.scale(filters.flipHorizontal, filters.flipVertical);
        ctx.drawImage(fields.previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        // document.body.appendChild(canvas);

        const link = document.createElement("a");
        link.download = "image.jpg";
        link.href = canvas.toDataURL();
        link.click();
    }

    function addEventsElements() {
        fields.chooseImgBtn.addEventListener("click", () => {
            fields.fileInput.click();
        });

        fields.fileInput.addEventListener("change", loadImage);

        fields.filterSlider.addEventListener("input", updateFilter);

        fields.filterOptions.forEach(option => {
            option.addEventListener("click", () => {
                document.querySelector(".filter .active").classList.remove("active");
                option.classList.add("active");
                fields.filterName.innerText = option.innerText;

                if (option.id === "brightness") {
                    fields.filterSlider.max = "200";
                    fields.filterSlider.value = filters.brightness;
                    fields.filterValue.innerText = `${filters.brightness}%`;
                }
                else if (option.id === "saturation") {
                    fields.filterSlider.max = "200";
                    fields.filterSlider.value = filters.saturation;
                    fields.filterValue.innerText = `${filters.saturation}%`;
                } else if (option.id === "inversion") {
                    fields.filterSlider.max = "100";
                    fields.filterSlider.value = filters.inversion;
                    fields.filterValue.innerText = `${filters.inversion}%`;
                } else {
                    fields.filterSlider.max = "100";
                    fields.filterSlider.value = filters.grayscale;
                    fields.filterValue.innerText = `${filters.grayscale}%`;
                }
            });
        });

        fields.rotateOptions.forEach(option => {
            option.addEventListener("click", () => {
                if (option.id === "left") {
                    filters.rotate -= 90;
                } else if (option.id === "right") {
                    filters.rotate += 90;
                } else if (option.id === "horizontal") {
                    filters.flipHorizontal = filters.flipHorizontal === 1 ? -1 : 1;
                } else {
                    filters.flipVertical = filters.flipVertical === 1 ? -1 : 1;
                }
                applyFilters();
            });
        });

        fields.resetFilterBtn.addEventListener("click", resetFilters);

        fields.saveImageBtn.addEventListener("click", saveImage);
    }

    function init() {
        addEventsElements();
    }

    return {
        init
    }
})();

document.addEventListener("DOMContentLoaded", functions.init);