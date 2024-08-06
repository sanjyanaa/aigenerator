const API_KEY = "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";
const submitIcon = document.querySelector("#submit-icon");
const inputElement = document.querySelector("#user-prompt");
const imagesSection = document.querySelector(".images-section");
const jewellerySelect = document.querySelector("#jewellery");
const goldSelect = document.querySelector("#gold");
const gemstoneSelect = document.querySelector("#gemstone");

const getImages = async (retryCount = 0) => {
    const userPrompt = inputElement.value.trim();
    const jewellery = jewellerySelect.value;
    const gold = goldSelect.value;
    const gemstone = gemstoneSelect.value;
    const fullPrompt = `Create a highly photorealistic image of a ${jewellery} made of ${gold} featuring ${gemstone}. Ensure the design is detailed and can be made in real life. ${userPrompt}`;

    if (userPrompt === "") {
        alert("Please enter a prompt.");
        return;
    }

    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt: fullPrompt,
            n: 2,
            size: "1024x1024",
        
        })
    };

    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", options);
        if (!response.ok) {
            if (response.status === 429 && retryCount < 5) {
                // Implement exponential backoff
                const delay = Math.pow(2, retryCount) * 1000; // delay in milliseconds
                console.warn(`Rate limit exceeded. Retrying in ${delay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return getImages(retryCount + 1);
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        data?.data.forEach(imageObject => {
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');
            const imageElement = document.createElement('img');
            imageElement.setAttribute('src', imageObject.url);
            imageContainer.append(imageElement);
            imagesSection.append(imageContainer);
        });
    } catch (error) {
        console.error('Error fetching images:', error);
    }
};

submitIcon.addEventListener("click", () => getImages());
