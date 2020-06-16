"use strict";

import "./vendor.css";

let channels = [];

let channelsGridElement; 
let filterInput; 

const addEventListenersToButtons = () => {
  const sortingRadioButtons = document.querySelectorAll(".sort");
  if (!sortingRadioButtons) return;
  sortingRadioButtons.forEach((button) => {
    button.addEventListener("change", sortChannels);
  });

  channelsGridElement = document.getElementById("channels");
  filterInput = document.getElementById("filter-input");

  const clearButton = document.getElementById("clear-btn");
  clearButton.addEventListener("click", clearFormAndFilterInput);
  filterInput.addEventListener("keyup", (event) => filterContent(event.target.value));
};

document.onreadystatechange = async () => {
  if (document.readyState === "interactive") {
    addEventListenersToButtons();

    const fetchDataResult = await fetchData();

    if (!fetchDataResult || !!!fetchDataResult.length) return;
    createChannelList(fetchDataResult);
    renderChannels();
  }
};

const fetchData = async () => {
  try {
    let resp = await fetch("assets/channels.json", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await resp.json();
  } catch (err) {
    console.log("Error", err);
  }
};

const createChannelList = (channelsData) => {
  channels = channelsData.map(
    ({ title, statistics, customUrl, thumbnails }, index) => {
      const { subscriberCount, videoCount, viewCount } = statistics;

      const content = `<div id="${index}" class="channel">
  <div class="channel__item logo"><a href="${customUrl}" target="_blank"><img src="${
        thumbnails.medium.url
      }"/></a></div>
  <span class="channel__item title">${title}</span>
  <span class="channel__item category">SUBSCRIBERS:</span>
  <span class="channel__item category">VIDEOS:</span>
  <span class="channel__item category">VIEWS:</span>
  <span class="channel__item statistics">${setEnglishNotation(
    subscriberCount
  )}</span>
  <span class="channel__item statistics">${setEnglishNotation(
    videoCount
  )}</span>
  <span class="channel__item statistics">${setEnglishNotation(viewCount)}</span>
  </div>`;

      return {
        id: index,
        title,
        subscriberCount,
        videoCount,
        viewCount,
        content,
      };
    }
  );
};

const setEnglishNotation = (value) => {
  if (!value && value !== 0) {
    return "";
  }

  if (typeof value !== "string" && typeof value !== "number") {
    return "";
  }
  let convertedValue =
    typeof value === "number"
      ? Array.from(value.toString())
      : Array.from(value);
  for (let i = convertedValue.length - 3; i > 0; i -= 3) {
    convertedValue.splice(i, 0, ",");
  }
  return convertedValue.join("");
};

const sortChannels = (event) => {
  const element = event.target;
  if (!element) return;
  const elementId = element.id;
  const sortedChannelsResult = getSortedChannels(elementId);
  if (!sortedChannelsResult) return;
  renderChannels(sortedChannelsResult);


  if (filterInput && filterInput.value !== "") {
    filterContent(filterInput.value);
  }
};

const getSortedChannels = (type) => {
  if (!type) return;
  let sortingType;
  switch (type) {
    case "sort-title":
      sortingType = "title";
      break;
    case "sort-subscribers":
      sortingType = "subscriberCount";
      break;
    case "sort-videos":
      sortingType = "videoCount";
      break;
    case "sort-views":
      sortingType = "viewCount";
      break;
    default:
      return;
  }

  if (!!!channels.length) return;

  return [...channels].sort((a, b) => {
    let first = a[sortingType];
    let second = b[sortingType];

    if (!first || !second) return 0;

    if (!isNaN(first) && !isNaN(second)) {
      first = +first;
      second = +second;
    } else {
      first.toLowerCase();
      second.toLowerCase();
    }
    if (first > second) {
      return 1;
    } else if (first < second) {
      return -1;
    }
    return 0;
  });
};

const filterContent = (value) => {
  channels.forEach(({id, title}) => {
    if (!id && id !== 0 || !title) return;
    const channelElement = document.getElementById(id);

    if (!channelElement) {
      return;
    }
    const channelClassList = channelElement.classList;
    
    !title.toLowerCase().startsWith(value.toLowerCase())
      ? channelClassList.add("hidden")
      : channelClassList.remove("hidden");
  });
};

const clearFormAndFilterInput = () => {
  filterInput.value = "";
  renderChannels();
};

const renderChannels = (contentToRender = channels) => {
  if (!channelsGridElement) return;

  let channelsToRender = contentToRender.reduce(
    (prev, { content: currentContent = "" }, index) => {
      return index !== 1 ? (prev += currentContent) : prev.content || "";
    }
  );

  if (!channelsToRender) return;

  if (channelsGridElement) {
    channelsGridElement.innerHTML = channelsToRender;
  }
};
