const CATEGORY_CHECKBOX_PREFIX = "merch-checkbox-";
const FANDOM_CHECKBOX_PREFIX = "fandom-checkbox-";

var data;
var groupTiles = Array();

async function loadData() {
    var response = await fetch("data/data.json");
    data = await response.json();
}

function populateLeftPane() {
    // Populate merchandise list
    var categories = data.categories;
    var categoryList = document.querySelector("#merch-list");
    for (let slug in categories) {
        let name = categories[slug];
        let listItem = document.createElement("li");
        // Create checkbox
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = CATEGORY_CHECKBOX_PREFIX + slug;
        checkbox.value = slug;
        checkbox.addEventListener("change", filterGroups);
        // Create label
        let label = document.createElement("label");
        label.innerText = name;
        label.htmlFor = checkbox.id;
        // Put everything together
        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        categoryList.appendChild(listItem);
    }

    // Populate fandom list
    var fandoms = data.fandoms;
    var fandomList = document.getElementById("fandom-list");
    for (let slug in fandoms) {
        let title = fandoms[slug].title;
        let listItem = document.createElement("li");
        // Create checkbox
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = FANDOM_CHECKBOX_PREFIX + slug;
        checkbox.value = slug;
        checkbox.addEventListener("change", filterGroups);
        // Create label
        let label = document.createElement("label");
        label.innerText = title;
        label.htmlFor = checkbox.id;
        // Put everything together
        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        fandomList.appendChild(listItem);
    }
}

function populateRightPane() {
    var groups = data.groups;
    var groupContainer = document.getElementById("group-container");
    for (let i in groups) {
        let group = groups[i];
        let groupTile = document.createElement("div");
        groupTile.classList.add("group-tile");
        groupTile.dataset.groupIndex = i;
        groupTile.addEventListener("click", populateModal);
        if (group.image) {
            let imageUrl = "img/" + group.image;
            groupTile.style.backgroundImage = "url('" + imageUrl + "')";
        }
        groupTiles.push(groupTile);
        groupContainer.appendChild(groupTile);
    }
}

function filterGroups() {
    var groupDisplayFlags = Array(data.groups.length).fill(true);

    // Gather checkboxes
    var categoryCheckboxes = document.querySelectorAll("#merch-list input[type=checkbox]");
    var fandomCheckboxes = document.querySelectorAll("#fandom-list input[type=checkbox]");

    // Check if filtering is necessary
    var filterCategoriesEnable = Array.from(categoryCheckboxes, x => x.checked).some(x => x);
    var filterFandomsEnable = Array.from(fandomCheckboxes, x => x.checked).some(x => x);

    // Filter by categories
    if (filterCategoriesEnable) {
        var filterCategories = Array.from(categoryCheckboxes).filter(x => x.checked).map(x => x.value);
        for (let i in data.groups) {
            let group = data.groups[i];
            let groupHasCategory = group.categories.some(x => filterCategories.includes(x));
            if (!groupHasCategory) {
                groupDisplayFlags[i] = false;
            }
        }
    }

    // Filter by fandoms
    if (filterFandomsEnable) {
        var filterFandoms = Array.from(fandomCheckboxes).filter(x => x.checked).map(x => x.value);
        // Gather any sub-fandoms
        for (let fandom of filterFandoms) {
            let subFandoms = data.fandoms[fandom].subs;
            if (subFandoms) {
                filterFandoms = filterFandoms.concat(subFandoms);
            }
        }
        for (let i in data.groups) {
            let group = data.groups[i];
            let groupHasFandom = group.fandoms.some(x => filterFandoms.includes(x));
            if (!groupHasFandom) {
                groupDisplayFlags[i] = false;
            }
        }
    }

    // Show/hide the group tiles
    for (let i in groupDisplayFlags) {
        if (groupDisplayFlags[i]) {
            groupTiles[i].classList.remove("hide");
        } else {
            groupTiles[i].classList.add("hide");
        }
    }
}

function populateModal(event) {
    // Get the group
    var groupIndex = event.target.dataset.groupIndex;
    var group = data.groups[groupIndex];

    // Gather group info
    var categories = group.categories.map(x => data.categories[x]);
    var fandoms = group.fandoms.map(x => data.fandoms[x].title);

    // Populate the modal
    document.getElementById("modal-group-image").src = "img/" + group.image;
    document.getElementById("modal-group-table").innerText = group.table;
    document.getElementById("modal-group-name").innerText = group.name;
    document.getElementById("modal-group-merch").innerText = categories.join(", ");
    document.getElementById("modal-group-fandoms").innerText = fandoms.join(", ");

    // Show the modal
    document.getElementById("modal-container").style.display = "block";
}

function hideModal() {
    document.getElementById("modal-container").style.display = "none";
}

function initModal() {
    document.getElementById("modal-overlay").addEventListener("click", hideModal);
}

async function init() {
    await loadData();
    populateLeftPane();
    populateRightPane();
    initModal();
}

document.addEventListener("DOMContentLoaded", init);
