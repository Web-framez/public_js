const heartButton = document.getElementById("heart");
heartButton.addEventListener("click", heartButtonHandle);
let modalWF = document.getElementById("wg-myModal");
let spanWF = document.getElementsByClassName("wg-close")[0];
let modalLink = document.getElementById("wg-myModal1");
let spanLink = document.getElementsByClassName("close1")[0];
let modalDrawer = document.getElementById("wg-myModalD");
let spanDrawer = document.getElementsByClassName("closeD")[0];
var shareModal = document.getElementById("myshareModal");
var shareModalContent = document.querySelector(".modal-share-content");
var successDiv = document.querySelector(".successDiv");
var successInnerDiv = document.querySelector(".successInnerDiv");
let customButton = JSON.parse(heartButton.getAttribute("button-setting"));
let customLanguage = JSON.parse(heartButton.getAttribute("language-setting").replace(/~/g, "'"));
let generalSetting = JSON.parse(heartButton.getAttribute("general-setting"));
let getThemeName = JSON.parse(heartButton.getAttribute("theme-name"));
let advanceSetting = JSON.parse(heartButton.getAttribute("advance-setting").replace(/~/g, "'"));
let collectionBtnSetting = JSON.parse(heartButton.getAttribute("collection-btn-setting"));
let currentPlan;
let currencyType = heartButton.getAttribute("currency-type").substring(0, heartButton.getAttribute("currency-type").indexOf("{{")).trim();
let getFontFamily = heartButton.getAttribute("get-font-family").replace(/^"(.*)"$/, "$1");
let getFontFamilyFallback = heartButton.getAttribute("get-font-family-fallback");
let shopDomain = heartButton.getAttribute("shop-domain");
const permanentDomain = heartButton.getAttribute("permanent-domain");
const wf_shopName = heartButton.getAttribute("shop-name");
const customerEmail = heartButton.getAttribute("customer-email");
let checkAllProduct = document.getElementById("wf-custom-Product");
let checkButtonProduct = document.getElementById("wf-custom-button-Product");
let wishlistIconValue = "";
let wishlistCollectionIconValue = "";
let wishlistBtnValue = "";
let currentProduct = [];
let currentButtonProduct = [];
let storeFrontDefLang;
const onlyTextButton = customButton.type === "icon-text" || customButton.type === "text";
let isCountValid = false;
let isCollectionCount = false;
let shouldAutoUpdateRender = false;

//MULTIWISHLIST
const getMultiWishlistDiv = document.getElementById("wg-multiWishlistMainDiv");
const closeMultiWishlistDiv = document.getElementsByClassName("wg-closeMultiwishlist")[0];
let isMultiwishlistTrue = false;
let multiArray = [];
let checkedItems = [];
let currentIndex = 0;
let nonCheckedItems = [];
let newQuantityOutLook = 1;

const modalDrawerTextColor = generalSetting?.wlTextColor?.color ? generalSetting?.wlTextColor?.color : generalSetting.wlTextColor;
document.addEventListener("DOMContentLoaded", getCurentPlanSql);

const serverURL = "http://localhost:5000"; // -------------- local
// const serverURL = 'http://wishlist-api.webframez.com'; // -------------- production
// const serverURL = 'https://wishlist-guru-api.webframez.com'; // -------------- stagging

const injectCoderr = document.getElementById("wf-custom-wishBtn-inject");
let injectCodeCondition = injectCoderr?.getAttribute("inject-code-automatic") || "automatic";

let varriantId;
let allWishlistData = [];
let allProducts = [];

const colIconDefaultColor = collectionBtnSetting?.iconDefaultColor?.filterColor
    ? collectionBtnSetting?.iconDefaultColor?.filterColor
    : collectionBtnSetting.iconDefaultColor;
const colIconSelectedColor = collectionBtnSetting?.iconSelectedColor.filterColor
    ? collectionBtnSetting?.iconSelectedColor?.filterColor
    : collectionBtnSetting.iconSelectedColor;

let wfGetDomain = window.location.href;
let wfDomainUrl = window.location.href;

if (wfDomainUrl.indexOf("/collections/") !== -1) {
    wfGetDomain = wfDomainUrl.split("/collections/")[0];
} else if (wfDomainUrl.indexOf("/products/") !== -1) {
    wfGetDomain = wfDomainUrl.split("/products/")[0];
} else if (wfDomainUrl.indexOf("/pages/") !== -1) {
    wfGetDomain = wfDomainUrl.split("/pages/")[0];
} else if (wfDomainUrl.indexOf("/cart") !== -1) {
    wfGetDomain = wfDomainUrl.split("/cart")[0];
} else if (wfDomainUrl.indexOf("/search/") !== -1) {
    wfGetDomain = wfDomainUrl.split("/search/")[0];
} else if (wfDomainUrl.indexOf("/blogs/") !== -1) {
    wfGetDomain = wfDomainUrl.split("/blogs/")[0];
} else if (wfDomainUrl.indexOf("/collections") !== -1) {
    wfGetDomain = wfDomainUrl.split("/collections")[0];
} else if (wfDomainUrl.indexOf("/search") !== -1) {
    wfGetDomain = wfDomainUrl.split("/search")[0];
} else if (wfDomainUrl.indexOf("/apps/") !== -1) {
    wfGetDomain = wfDomainUrl.split("/apps/")[0];
} else if (wfDomainUrl.indexOf("/account") !== -1) {
    wfGetDomain = wfDomainUrl.split("/account")[0];
} else if (wfDomainUrl.indexOf("/?_") !== -1) {
    wfGetDomain = wfDomainUrl.split("/?_")[0];
} else if (wfDomainUrl.indexOf("/?") !== -1) {
    wfGetDomain = wfDomainUrl.split("/?")[0];
}
else {
    wfGetDomain = window.location.href;
}

if (!wfGetDomain.endsWith("/")) {
    wfGetDomain += "/";
}

async function getCurentPlanSql() {
    try {
        const response = await fetch(`${serverURL}/get-current-plan-sql`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shopName: permanentDomain }),
        });
        const result = await response.json();
        if (result.data.length > 0) {
            currentPlan = result.data[0].active_plan_id;
        }
        const isPremiumPlan = currentPlan >= 2;
        if (collectionBtnSetting?.collectionShowCount === "yes") {
            collectionBtnSetting.collectionShowCount = "increaseNdecrease";
        }
        if (customButton.showCount === "yes") {
            customButton.showCount = "increaseNdecrease";
        }
        isCountValid = customButton.showCount === "increaseNdisable" || customButton.showCount === "increaseNdecrease" && isPremiumPlan;
        isCollectionCount = collectionBtnSetting?.collectionShowCount === "increaseNdisable" || collectionBtnSetting?.collectionShowCount === "increaseNdecrease" && isPremiumPlan;
        const isMultiwishlistTrueValue = heartButton.hasAttribute('isMultiwishlistTrue') ? heartButton.getAttribute('isMultiwishlistTrue') : "no";
        isMultiwishlistTrue = isMultiwishlistTrueValue === "yes" && currentPlan > 3;
        buttonStyleFxn();
        await Promise.all([getStoreLanguage(), showWishlistButtonType(), showCountAll()]);
        await showWishlistButtonType();
        if (isPremiumPlan) {
            setupIconInterval();
            setInterval(setupIconInterval, 1000);

            customIconInterval();
            setInterval(customIconInterval, 3000);

            customButtonInterval();
            setInterval(customButtonInterval, 3000);

            setupGridInterval();
            setInterval(setupGridInterval, 1500);

            if (permanentDomain === 'l-a-girl-cosmetics.myshopify.com') {
                customButtonIntervalLaGirl();
                setInterval(customButtonIntervalLaGirl, 3000);
            }
        }
        injectWishlistButtonForcely();
        await runsAfterDomContentLoaded();

        onWishlistRender();
        showWishlistBydefault();
        headerIconStyle();
        wishlistIcon();
        wishlistButtonForCollection();

        if (permanentDomain === '789dcd-a5.myshopify.com') {
            appendBodyOutsideHide()
            const floLauncher = document.querySelector('.wf-floating-launcher')
            if (floLauncher) {
                floLauncher.style.zIndex = 999
                floLauncher.style.bottom = '100px'
                floLauncher.style.right = '20px'
            }
        }
    } catch (error) {
        console.error("Error fetching current plan:", error);
    }
}

function appendBodyOutsideHide() {
    const mainBlock = document.getElementById('shopify-block-16428855274652595211');
    const pageCont = document.getElementById('PageContainer');
    if (mainBlock && pageCont) {
        pageCont.appendChild(mainBlock);
    } else {
        //   console.log('Element "abc" or "pagecont" not found');
    }
}

function updateLanguageFxn() {
    var h4Element = document.querySelectorAll(".searchData h4");
    for (var i = 0; i < h4Element.length; i++) {
        h4Element[i].innerHTML = customLanguage.searchBarText || "Search here";
    }
    var searchPlaceholder = document.querySelectorAll(".searchData input");
    for (var i = 0; i < searchPlaceholder.length; i++) {
        searchPlaceholder[i].placeholder =
            customLanguage.searchBarText || "Search here";
    }
    var poweredByUpdate = document.querySelectorAll(".powered-by-text");
    for (var i = 0; i < poweredByUpdate.length; i++) {
        poweredByUpdate[i].innerHTML = `${customLanguage.poweredByText || "Powered by"
            } <span onclick="goToWebframez()">Wishlist Guru</span>`;
    }
    if (
        getThemeName?.themeName === "Local" &&
        window.location.pathname === "/apps/wg-wishlist"
    ) {
        let checkClass = document.querySelectorAll(
            ".wishlist-page-main.page-width"
        );
        checkClass[0].classList.add("wg-wishlist-page-local");
        let addInlineCss = document.querySelector(
            ".wg-wishlist-page-local .modal-heading"
        );
        addInlineCss.style.display = "Block";
    } else if (getThemeName?.themeName === "Local") {
        let checkClass = document.querySelectorAll("#wg-myModal");
        checkClass[0].classList.add("wg-wishlist-modal-local");
        let addInlineCss = document.querySelector(
            ".wg-wishlist-modal-local .modal-heading"
        );
        addInlineCss.style.display = "Block";
    } else {
        // console.log("not a local theme");
    }

    if (getThemeName?.themeName === "Avenue") {
        const modalCss = document.querySelector(".wg-modal");
        if (modalCss) {
            modalCss.style.zIndex = "9999";
        }
        const shareModalCss = document.querySelector("#myshareModal");
        if (shareModalCss) {
            shareModalCss.style.zIndex = "9999";
        }
        const modalCssLink = document.querySelector(".wg-modal1");
        if (modalCssLink) {
            modalCssLink.style.zIndex = "99999";
        }
    } else if (
        getThemeName?.themeName === "Split" ||
        getThemeName?.themeName === "Multi" ||
        getThemeName?.themeName === "Highlight"
    ) {
        const modalCss = document.querySelector(".wg-modal");
        if (modalCss) {
            modalCss.style.zIndex = "99999";
        }
        const shareModalCss = document.querySelector("#myshareModal");
        if (shareModalCss) {
            shareModalCss.style.zIndex = "99999";
        }
        const modalCssLink = document.querySelector(".wg-modal1");
        if (modalCssLink) {
            modalCssLink.style.zIndex = "99999";
        }
    } else {
    }
    let modifiedString = getThemeName?.themeName?.replace(/ /g, "_");
    modifiedString = modifiedString?.toLowerCase();
    let themeNameClass = `wg-${modifiedString}-custom-css`;
    document.body.classList.add(themeNameClass);
}

function goToAccount() { window.location.href = "/account" }

function goToRegister() { window.location.href = "/account/register" }

//  -------------------LA girls usa------------------------
let checkAllLaGirlProduct = document.getElementById("wf-custom-Product-laGirlUsa");

async function checkCustomCodeProductLaGirl() {
    const getAllWishlistDiv = document.querySelectorAll(".wf-wishlist-lagirl");
    const allHandler = Array.from(getAllWishlistDiv, (wishlistDiv) =>
        wishlistDiv.getAttribute("product-id")
    ).filter(Boolean);
    const finalStoredData = parseInt(checkAllLaGirlProduct.getAttribute("data-aj"));
    if (parseInt(finalStoredData) !== allHandler.length) {
        checkAllLaGirlProduct.setAttribute("data-aj", allHandler.length);
        checkAllLaGirlProduct.setAttribute(
            "data-product-handle",
            JSON.stringify(allHandler)
        );
    } else {
        let checkProductHandle = JSON.parse(
            checkAllLaGirlProduct.getAttribute("data-product-handle")
        );
        const checkDataExist = await checkIdIncluded(
            checkProductHandle,
            allHandler
        );
        if (!checkDataExist) {
            checkAllLaGirlProduct.setAttribute("data-aj", allHandler.length);
            checkAllLaGirlProduct.setAttribute(
                "data-product-handle",
                JSON.stringify(allHandler)
            );
        } else {
            const wfWishlist = document.querySelectorAll(".icon-collection-laGirl");
            if (wfWishlist.length === 0 && allHandler.length !== 0) {
                checkAllLaGirlProduct.setAttribute("data-aj", "0");
                checkAllLaGirlProduct.setAttribute("data-product-handle", []);
                checkAllLaGirlProduct.setAttribute("data-aj", allHandler.length);
                checkAllLaGirlProduct.setAttribute(
                    "data-product-handle",
                    JSON.stringify(allHandler)
                );
            }
        }
    }
}

async function wishlistIconLaGirl() {
    const iconPosition = await checkIconPostion();
    if (currentPlan >= 2) {
        const getAllWishlistDiv = document.querySelectorAll(".wf-wishlist-lagirl");

        const prependPromisesWi = Array.from(getAllWishlistDiv).map(
            async (wishlistDiv) => {
                const selectedId = wishlistDiv.getAttribute("product-id");
                const selectedProductImgHandle = wishlistDiv.getAttribute("product-img");
                const selectedProductTitleHandle = wishlistDiv.getAttribute("product-title");
                const selectedProductHandle = wishlistDiv.getAttribute("product-handle");
                let addWishlistIcon = document.createElement("div");
                addWishlistIcon.style.zIndex = "10";
                addWishlistIcon.style.position = "relative";

                const { isComboIcon } = checkCollectionIcon();
                const countData = await isCountOrNot(selectedId, isCollectionCount);
                const newCountData = onlyTextButton ? `<div class="wf-product-count">${countData}</div>` : countData;
                const matchFound = await checkFound(allWishlistData, selectedId)

                if (allWishlistData.length > 0 && matchFound) {
                    addWishlistIcon.innerHTML = `<div class="collection_icon_new_selected "><div onClick="customCodeButtonClickLaGirl(${selectedId},'${selectedProductImgHandle}','${selectedProductTitleHandle}','${selectedProductHandle}')" style="filter: ${colIconSelectedColor}; ${collectionIconSize()}"  class="icon-collection icon-collection-laGirl ${isComboIcon ? iconPosition.iconStyle2 : iconPosition.iconStyle
                        }"></div></div>${isCollectionCount ? newCountData : ""}`;
                } else {
                    addWishlistIcon.innerHTML = `<div class="collection_icon_new "><div style="filter: ${colIconDefaultColor}; ${collectionIconSize()}"  onClick="customCodeButtonClickLaGirl(${selectedId},'${selectedProductImgHandle}','${selectedProductTitleHandle}','${selectedProductHandle}')" class="icon-collection icon-collection-laGirl ${iconPosition.iconStyle}"></div></div>${isCollectionCount ? newCountData : ""}`;
                }
                wishlistDiv.innerHTML = addWishlistIcon.innerHTML;
                isCollectionCount && renderCollectionTextColor(matchFound ? "added" : "removed", selectedId, isCollectionCount);
            }
        );

        try {
            await Promise.all(prependPromisesWi);
            const allShow = document.querySelectorAll(".wf-wishlist-lagirl");
            allShow.forEach((wishlistDiv) => {
                wishlistDiv.style.display = "block";
            });
        } catch (error) {
            console.log("Error occurred:", error);
        }
    }
}

async function customCodeButtonClickLaGirl(selectedId, imgHandle, productTitle, productHandle) {
    try {

        let buttonClickData = {
            productId: selectedId,
            variantId: selectedId,
            price: null,
            handle: productHandle,
            title: productTitle,
            image: imgHandle,
            quantity: 1,
            language: wfGetDomain,
        };

        const res = await showLoginPopup(selectedId);
        if (res) return;

        const matchFound = await checkFound(allWishlistData, selectedId)

        if (isMultiwishlistTrue) {
            renderPopupLoader()
            if (allWishlistData.length > 0 && matchFound) {
                buttonClickData.isDelete = "yes";
                openMultiWishlist(buttonClickData, selectedId, "customIcon")
            } else {
                openMultiWishlist(buttonClickData, selectedId, "customIcon")
            }
        } else {
            buttonClickData.wishlistName = matchFound ? ["wfNotMulti"] : ["favourites"];
            await checkCollectionCounterData(selectedId, !matchFound ? "add" : "remove")
            customIconAddedRemoveToWishlistLaGirl(selectedId, matchFound ? false : true);
            saveMainData(buttonClickData, selectedId, "customIcon")
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function customIconAddedRemoveToWishlistLaGirl(selectedId, matchinOrNot) {
    const iconPosition = await checkIconPostion();
    const { isComboIcon } = checkCollectionIcon();
    const countData = await isCountOrNot(selectedId, isCollectionCount);
    const newCountData = onlyTextButton ? `<div class="wf-product-count">${countData}</div>` : countData;

    const checkCollectionElements = document.querySelectorAll(`.wf-wishlist-collection-icon[product-id='${selectedId}'] .wf-product-count`);

    checkCollectionElements.forEach(element => {
        updateCountElement(element, newCountData);
    });

    let getCustomWishlist = document.querySelectorAll(".wf-wishlist-lagirl");
    if (getCustomWishlist.length !== 0) {
        const iconArray = Array.from(getCustomWishlist);
        iconArray.forEach((icon, index) => {
            const id = icon.getAttribute("product-id");
            if (Number(id) === Number(selectedId)) {
                let productHandle = icon.getAttribute("product-handle");
                const selectedId = icon.getAttribute("product-id");
                const selectedProductImgHandle = icon.getAttribute("product-img");
                const selectedProductTitleHandle = icon.getAttribute("product-title");
                let updateWishlistIcon = `<div class="${matchinOrNot ? "collection_icon_new_selected" : "collection_icon_new"}"><div style="${matchinOrNot ? `filter: ${colIconSelectedColor};` : `filter: ${colIconDefaultColor};`} ${collectionIconSize()} " onClick="customCodeButtonClickLaGirl(${selectedId},'${selectedProductImgHandle}','${selectedProductTitleHandle}','${productHandle}')" class="icon-collection icon-collection-laGirl ${isComboIcon && matchinOrNot ? iconPosition.iconStyle2 : iconPosition.iconStyle}"></div></div> ${isCollectionCount ? newCountData : ""}`;

                getCustomWishlist[index].innerHTML = updateWishlistIcon;

                isCollectionCount && renderCollectionTextColor(matchinOrNot ? "added" : "removed", selectedId, isCollectionCount);
            }
        });
    }
}


if (permanentDomain === 'l-a-girl-cosmetics.myshopify.com') {
    const checkObjBtnConfigLaGirl = {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
    };
    let CheckCustomButtonObserverLaGirl = new MutationObserver(wishlistIconLaGirl);
    CheckCustomButtonObserverLaGirl.observe(checkAllLaGirlProduct, checkObjBtnConfigLaGirl);
}

// -------------for updating quantity------------------
function checkQuantityValue(callback) {
    let value = parseInt(document.querySelector('input[name=quantity]').value, 10);
    const minusButton = document.querySelectorAll('quantity-input.quantity button[name="minus"]');
    const plusButton = document.querySelectorAll('quantity-input.quantity button[name="plus"]');
    const checkData = minusButton[minusButton.length - 1];
    const checkPlusData = plusButton[plusButton.length - 1];
    if (checkData) {
        checkData.addEventListener('click', () => {
            if (value > 1) {
                // console.log("value checkData", value);
                value--;
            }
            callback(value);
        });
    }
    if (checkPlusData) {
        checkPlusData.addEventListener('click', () => {
            // console.log("value checkPlusData", value);
            value++;
            callback(value);
        });
    }
    callback(value);
}

async function showLoginPopup(productId) {
    const isLogin = await getCurrentLoginFxn();
    const foundItem = allWishlistData.find(
        (item) => item.product_id === productId
    );
    if (
        currentPlan > 2 &&
        !foundItem &&
        isLogin === "" &&
        generalSetting?.createWishlist &&
        generalSetting.createWishlist === "yes"
    ) {
        createWishlistOrNot(productId);
        return true;
    } else {
        return false;
    }
}

async function getDefLanguage() {
    const params = {
        langName: btoa(`${customLanguage.textMsgLanguage}Message`),
    };
    try {
        const response = await fetch(`${serverURL}/get-default-store-lang`, {
            body: JSON.stringify(params),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching theme data:", error);
    }
}

function renderViewAs() {
    const gridBox = document.querySelector(".grid-option")?.style;
    const gridHeading = document.querySelector(".gridText")?.style;
    const searchBox = document.querySelector(".searchData")?.style;
    const shareBox = document.querySelector(".share-div")?.style;
    if (generalSetting?.hideGrid) {
        gridBox.display = "none";
        searchBox.justifyContent = "flex-start";
        shareBox.margin = "0 0 0 auto";
    }
    if (generalSetting?.hideViewAs) {
        gridHeading.display = "none";
    }
    if (generalSetting?.hideSearch) {
        searchBox.display = "none";
    }
}

async function createWishlistOrNot(productId) {
    const inputText = `
        <h3>${customLanguage?.isLoginParaText || storeFrontDefLang.isLoginParaText
        }</h3>
        <div class="wg-islogin-buttons">
            <button onClick="goToRegister()" class="wg-register-btn">${customLanguage?.createAccountAnchor || storeFrontDefLang.createAccountAnchor
        }</button>
            <button onClick="goToAccount()" class="wg-login-btn">${customLanguage?.loginTextAnchor || storeFrontDefLang?.loginTextAnchor
        }</button>
        </div>`;
    const wishlistModal = generalSetting.wishlistDisplay === "modal";
    const wishlistDrawer = generalSetting.wishlistDisplay === "drawer";
    const showElement = (selector, displayType = "block") => {
        const element = document.querySelector(selector);
        if (element) element.style.display = displayType;
    };
    if (wishlistModal) {
        // Modal settings
        modalWF.style.display = "block";
        showElement(".modal-page-auth", "none");
        showElement(".grid-outer-main", "none");
        showElement("#wg-modal-inner-content", "none");
        const modalContent = document.querySelector(".wg-modal-content");
        if (modalContent) {
            const wlWidth =
                generalSetting.createWishlist === "yes"
                    ? "50%"
                    : `${generalSetting.wlWidthInput}${generalSetting.wlWidthUnit}`;
            modalContent.style.maxWidth = wlWidth;
            if (generalSetting.createWishlist === "yes") {
                modalContent.style.top = "50%";
                modalContent.style.transform = "translate(0, -50%)";
            }
        }
        showElement("#wg-isLogin-modal");
        document.querySelector(".modal-heading").innerHTML = customLanguage.modalHeadingText || storeFrontDefLang.modalHeadingText;
        document.getElementById("wg-isLogin-modal").innerHTML = inputText;
        spanWF.onclick = () => {
            modalWF.style.display = "none";
            showElement("#wg-isLogin-modal", "none");
        };
    } else if (wishlistDrawer) {
        // Drawer settings
        document.querySelector(".sidenav").style.transform = "translateX(0%)";
        document.querySelector(".overlayy").style.height = "100vh";
        showElement(".swlb-div", "none");
        showElement(".drawer-main", "none");
        showElement(".drawer-button-div", "none");

        showElement("#wg-isLogin-drawer");
        document.querySelector(".drawer-text").innerHTML = customLanguage.modalHeadingText || storeFrontDefLang.modalHeadingText;
        document.getElementById("wg-isLogin-drawer").innerHTML = inputText;
    } else {
        localStorage.setItem("isLoginProductId", productId);
        window.location = `${wfGetDomain}apps/wg-wishlist`;
        // if (shopDomain === 'rubychikankari.com' || shopDomain === 'preahkomaitland.com.au') {
        //     window.location = `${wfGetDomain}pages/wishlist`;
        // } else {
        //     window.location = `${wfGetDomain}pages/wg-wishlist`;
        // }
    }
}

async function getStoreLanguage() {
    try {
        const response = await fetch(`${serverURL}/get-store-language`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                shopName: permanentDomain,
                url: currentPlan > 2 ? wfGetDomain : `https://${shopDomain}/`,
            }),
        });

        if (!response.ok)
            throw new Error(`Network response was not ok: ${response.statusText}`);

        const result = await response.json();
        const translationData =
            result.data.length > 0
                ? result.data[0].translations
                : heartButton.getAttribute("language-setting");

        customLanguage = JSON.parse(translationData.replace(/~/g, "'"));
        shouldAutoUpdateRender = true;
        updateLanguageFxn();
    } catch (error) {
        console.error("Error fetching store language:", error);
    }
}

async function runsAfterDomContentLoaded() {
    if (
        collectionBtnSetting["collectionIconType"] === null ||
        collectionBtnSetting["collectionIconType"] === undefined ||
        collectionBtnSetting["collectionIconType"] === ""
    ) {
        if (collectionBtnSetting.iconType === "star") {
            collectionBtnSetting["collectionIconType"] = "starOutlineSolid";
        } else if (collectionBtnSetting.iconType === "save") {
            collectionBtnSetting["collectionIconType"] = "saveOutlineSolid";
        } else {
            collectionBtnSetting["collectionIconType"] = "heartOutlineSolid";
        }
    }
}

async function detechThemeName() {
    const params = {
        themeName: btoa(getThemeName.themeName),
        filter: btoa("none"),
    };
    try {
        const response = await fetch(`${serverURL}/get-theme-data`, {
            body: JSON.stringify(params),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching theme data:", error);
    }
}

let themeCurrentSelectors = {};
detechThemeName()
    .then((result) => {
        themeCurrentSelectors = result;
    })
    .catch((error) => {
        console.error("Promise rejected:", error);
    });

/** INJECT BUTTON **/
async function injectWishlistButtonForcely() {
    if (injectCodeCondition !== "automatic" || !window.location.pathname.includes("/products/")) return;
    const proHandle = injectCoderr.getAttribute("data-product-handle");
    const proId = injectCoderr.getAttribute("data-product-id");
    try {
        await injectCode(proId, proHandle);
    } catch (error) {
        console.error("Error injecting wishlist button:", error);
    }
}

async function injectCode(proId, proHandle) {
    const mainWishlistDiv = document.getElementById("wishlist-guru");
    if (mainWishlistDiv) return;
    const allForms = Array.from(document.querySelectorAll("form")).filter(
        (form) => form.action.endsWith("/cart/add")
    );
    if (allForms.length === 0) return;
    const addToWishlistData = await renderButtonAddToWishlist(proId, isCountValid);
    const alreadyAddedToWishlistData = await renderButtonAddedToWishlist(proId, isCountValid);
    const renderBorderValue = await checkFound(allWishlistData, parseInt(proId))
    const addWishlistButton = document.createElement("div");
    addWishlistButton.innerHTML = `<div class="button-collection">${renderBorderValue ? alreadyAddedToWishlistData : addToWishlistData}</div>`;
    const wishlistDivs = document.createElement("div");
    wishlistDivs.id = "inject_wish_button";
    wishlistDivs.style.margin = customButton.type === "icon" ? customButton.textAlign === "center" ? "0 auto" : customButton.textAlign === "left" ? "0" : "0 0 0 auto" : "10px 0px";
    wishlistDivs.style.width = renderWidth(isCountValid);
    wishlistDivs.style.position = "relative";
    wishlistDivs.innerHTML = addWishlistButton.innerHTML;

    if (allForms.length > 0 && allForms.length < 3) {
        const formToAppend = allForms.length <= 3
            ? allForms[allForms.length - 1]
            : allForms[allForms.length - 2];
        formToAppend.appendChild(wishlistDivs);
    } else {
        for (const form of allForms) {
            const elementToCheck = form.querySelector('button[type="button"], button[name="add"], input[type="submit"], button[type="submit"]');
            if (elementToCheck) {
                form.appendChild(wishlistDivs);
                break;
            }
        }
    }
    isCountValid && renderBorder(renderBorderValue ? "added" : "removed", isCountValid);
    wishlistDivs.onclick = () => injectButtonClick(proId, proHandle);
}

async function injectButtonClick(selectedId, handle) {
    try {
        const { productPrice, varriantId, variant_img, buttonJsonData } = await getProductData(handle);
        const quantityInput = document.querySelector('input[name="quantity"]');
        const quantityValue = quantityInput?.value;
        let buttonData = {
            productId: buttonJsonData.id,
            variantId: varriantId != "" ? varriantId : buttonJsonData.variants[0].id,
            price: productPrice,
            handle: buttonJsonData.handle,
            title: buttonJsonData.title,
            image: variant_img,
            quantity: quantityValue || 1,
            language: wfGetDomain,
        };
        const res = await showLoginPopup(selectedId);
        if (res) return;
        const matchFound = await checkFound(allWishlistData, selectedId)
        if (isMultiwishlistTrue) {
            renderPopupLoader();
            if (allWishlistData.length > 0 && matchFound) {
                buttonData.isDelete = "yes";
                openMultiWishlist(buttonData, selectedId, "inject")
            } else {
                openMultiWishlist(buttonData, selectedId, "inject")
            }
        } else {
            buttonData.wishlistName = matchFound ? ["wfNotMulti"] : ["favourites"];
            await checkCounterData(selectedId, !matchFound ? "add" : "remove")
            injectButtonAddedRemoveWishlist(selectedId, matchFound ? false : true)
            saveMainData(buttonData, selectedId, "inject");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function injectButtonAddedRemoveWishlist(selectedId, matchingOrNot) {
    const addToWishlistData = await renderButtonAddToWishlist(selectedId, isCountValid);
    const alreadyAddedToWishlistData = await renderButtonAddedToWishlist(selectedId, isCountValid);
    const proHandle = injectCoderr.getAttribute("data-product-handle");
    const proId = injectCoderr.getAttribute("data-product-id");
    let updateWishlistButton = document.createElement("div");
    const getIdOfInjectWish = document.getElementById("inject_wish_button");
    if (Number(selectedId) === Number(proId)) {
        updateWishlistButton.innerHTML = matchingOrNot
            ? `<div class="button-collection">${alreadyAddedToWishlistData}</div>`
            : `<div class="button-collection">${addToWishlistData}</div>`;
        getIdOfInjectWish && (getIdOfInjectWish.innerHTML = updateWishlistButton.innerHTML);
        matchingOrNot ? renderBorder("added", isCountValid) : renderBorder("removed", isCountValid);
    }
}

function renderWidth(isCountValid) {
    if (customButton?.type !== "icon") {
        return "100%";
    }
    return isCountValid ? "max-content" : "40px";
}

async function getProductData(handle) {
    try {
        const buttonResponseData = await fetch(`${wfGetDomain}products/${handle}.js`);
        const buttonJsonData = await buttonResponseData.json();
        const variantData = buttonJsonData.variants;
        let productPrice = null;
        const urlNew = new URL(location.href).searchParams.get("variant");
        let varriantId = "";
        if (urlNew != null) {
            varriantId = JSON.parse(urlNew);
        }
        let variant_img = "";
        variantData.map((data) => {
            if (data.id === parseInt(urlNew)) {
                productPrice = Number(data.price) / 100;
                if (data.featured_image === null) {
                    variant_img = buttonJsonData.images[0];
                } else {
                    variant_img = data?.featured_image.src;
                }
            } else if (urlNew == null) {
                productPrice = Number(data.price) / 100;
                if (variantData[0]) {
                    if (data.featured_image === null) {
                        variant_img = buttonJsonData.images[0];
                    } else {
                        variant_img = data?.featured_image.src;
                    }
                }
            }
        });
        return { productPrice, varriantId, variant_img, buttonJsonData };
    } catch (error) {
        console.log(error);
    }
}

async function getCountData(productId) {
    const getCurrentLogin = await getCurrentLoginFxn();
    try {
        const userData = await fetch(`${serverURL}/get-product-count-data`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productId: productId,
                shopName: permanentDomain,
                customerEmail: getCurrentLogin,
                currentToken: localStorage.getItem("access-token"),
            }),
        })
        let result = await userData.json();
        return result.data
    } catch (error) {
        console.log("errr ", error);
    }
}

async function getCountOfProduct(id) {
    const productCountData = await getCountData(id);
    return onlyTextButton
        ? productCountData
        : `<div class="wf-product-count">${productCountData}</div>`;
}

async function isCountOrNot(proId, isCountValid) {
    if (isCountValid) {
        return await getCountOfProduct(proId);
    } else {
        return "";
    }
}

function onWishlistRender() {
    const tostNotificationDiv = document.createElement("div");
    tostNotificationDiv.className = "wf-toast-notification";
    tostNotificationDiv.id = "notificationDiv";
    tostNotificationDiv.style.display = "none";
    document.body.appendChild(tostNotificationDiv);
    const addWshistListButton = document.querySelector("#wishlist");
    if (generalSetting.notificationTypeOption === "text-above") {
        let newElement = document.createElement("div");
        newElement.className = "wf-text-notification-above";
        newElement.style.display = "none";
        if (addWshistListButton) {
            addWshistListButton.parentElement.insertBefore(newElement, addWshistListButton);
        }
    }
    if (generalSetting.notificationTypeOption === "text-below") {
        let newElement = document.createElement("div");
        newElement.className = "wf-text-notification-below";
        newElement.style.display = "none";
        if (addWshistListButton) {
            addWshistListButton.parentNode.insertBefore(newElement, addWshistListButton.nextSibling);
        }
    }
    if (document.querySelectorAll(".wf-wishlist").length > 0) {
        wishlistIconValue = document.querySelectorAll(".wf-wishlist");
    }
    if (document.querySelectorAll(".wf-wishlist-collection-icon").length > 0) {
        wishlistCollectionIconValue = document.querySelectorAll(".wf-wishlist-collection-icon");
    }
    if (document.querySelectorAll(".wf-wishlist-button").length > 0) {
        wishlistBtnValue = document.querySelectorAll(".wf-wishlist-button");
    }
}

function headerIconStyle() {
    let heartIconsCSS = document.querySelectorAll(".red-heart");
    if (heartIconsCSS.length > 0) {
        heartIconsCSS.forEach((heartIconCSS) => {
            heartIconCSS.style.filter = generalSetting.heartIconFilter;
            heartIconCSS.style.height = `${generalSetting.heartIconWidth}px`;
            heartIconCSS.style.width = `${generalSetting.heartIconWidth}px`;
        });
    }
}

function showWishlistBydefault() {
    let params = new URL(document.location).searchParams;
    let showType = params.get("showtype");
    if (showType === "getdisplaytype") {
        heartButtonHandle();
    }
}

function checkIconPostion() {
    let iconPosition = "";
    let iconStyle = "";
    let iconStyle2 = "";
    let iconHeight = "";
    let checkClassExist = false;
    if (collectionBtnSetting.iconPosition === "icon-top-left") {
        iconPosition = "wg-icon-top-left";
    } else if (collectionBtnSetting.iconPosition === "icon-bottom-left") {
        iconPosition = "wg-icon-bottom-left";
        iconHeight = "30";
    } else if (collectionBtnSetting.iconPosition === "icon-top-right") {
        iconPosition = "wg-icon-top-right";
    } else if (collectionBtnSetting.iconPosition === "icon-bottom-right") {
        iconPosition = "wg-icon-bottom-right";
        iconHeight = "30";
    }
    if (customButton.iconType === "heart") {
        if (collectionBtnSetting.collectionIconType === "heartBlank") {
            iconStyle = "wg-heart-icon-blank";
        } else if (collectionBtnSetting.collectionIconType === "heartSolid") {
            iconStyle = "wg-heart-icon-solid";
        } else if (
            collectionBtnSetting.collectionIconType === "heartOutlineSolid"
        ) {
            iconStyle = "wg-heart-icon-outline-solid";
        } else if (
            collectionBtnSetting.collectionIconType === "heartOutlineBlank"
        ) {
            iconStyle = "wg-heart-icon-outline-blank";
        } else if (collectionBtnSetting.collectionIconType === "comboHeart") {
            iconStyle = "wg-heart-icon-blank";
            iconStyle2 = "wg-heart-icon-solid";
        }
    } else if (customButton.iconType === "star") {
        if (collectionBtnSetting.collectionIconType === "starBlank") {
            iconStyle = "wg-star-icon-blank";
        } else if (collectionBtnSetting.collectionIconType === "starSolid") {
            iconStyle = "wg-star-icon-solid";
        } else if (collectionBtnSetting.collectionIconType === "starOutlineSolid") {
            iconStyle = "wg-star-icon-outline-solid";
        } else if (collectionBtnSetting.collectionIconType === "starOutlineBlank") {
            iconStyle = "wg-star-icon-outline-blank";
        } else if (collectionBtnSetting.collectionIconType === "comboStar") {
            iconStyle = "wg-star-icon-blank";
            iconStyle2 = "wg-star-icon-solid";
        }
    } else if (customButton.iconType === "save") {
        if (collectionBtnSetting.collectionIconType === "saveBlank") {
            iconStyle = "wg-save-icon-blank";
        } else if (collectionBtnSetting.collectionIconType === "saveSolid") {
            iconStyle = "wg-save-icon-solid";
        } else if (collectionBtnSetting.collectionIconType === "saveOutlineSolid") {
            iconStyle = "wg-save-icon-outline-solid";
        } else if (collectionBtnSetting.collectionIconType === "saveOutlineBlank") {
            iconStyle = "wg-save-icon-outline-blank";
        } else if (collectionBtnSetting.collectionIconType === "comboSave") {
            iconStyle = "wg-save-icon-blank";
            iconStyle2 = "wg-save-icon-solid";
        }
    }
    if (
        iconPosition === "wg-icon-bottom-left" ||
        iconPosition === "wg-icon-bottom-right"
    ) {
        checkClassExist = true;
    }
    return {
        iconPosition: iconPosition,
        iconStyle: iconStyle,
        iconHeight: iconHeight,
        checkClassExist: checkClassExist,
        iconStyle2,
    };
}

async function quickViewFxn() {
    let getMainDiv = document.querySelectorAll(".wf-wishlist-quick-view");
    for (let i = 0; i < getMainDiv.length; i++) {
        let buttonStyle = getMainDiv[0].getAttribute("data-style");
        var addWishlistIcon = document.createElement("div");
        addWishlistIcon.style.zIndex = "10";
        addWishlistIcon.style.position = "relative";
        let selectedId = getMainDiv[i].getAttribute("data-productid");
        let wishlistData = await getDataFromSql();
        if (wishlistData.length > 0) {
            const found = wishlistData.find(
                (element) => element.product_id == selectedId
            );
            if (found) {
                buttonStyle === "icon"
                    ? (addWishlistIcon.innerHTML = `<div onClick="buttonClick(${selectedId}, ${i}, 'one')" class="icon-collection ${customButton.iconType === "heart" && "heartICON2"
                        } ${customButton.iconType === "star" && "starICON2"} ${customButton.iconType === "save" && "saveICON2"
                        } " ><span class="span-hearticon"></span></div>`)
                    : (addWishlistIcon.innerHTML = `<div onClick="buttonClick(${selectedId}, ${i}, 'one')" class="button-collection" style="background-color: ${customButton.bgColor}; color: ${customButton.textColor}" >${customLanguage.addedToWishlist}</div>`);
            } else {
                buttonStyle === "icon"
                    ? (addWishlistIcon.innerHTML = `<div onClick="buttonClick(${selectedId}, ${i}, 'one')" class="icon-collection ${customButton.iconType === "heart" && "heartICON"
                        } ${customButton.iconType === "star" && "starICON"} ${customButton.iconType === "save" && "saveICON"
                        }" ><span class="span-hearticon"></span></div>`)
                    : (addWishlistIcon.innerHTML = `<div onClick="buttonClick(${selectedId}, ${i}, 'one')" class="button-collection" style="background-color: ${customButton.bgColor}; color: ${customButton.textColor}" >${customLanguage.addToWishlist}</div>`);
            }
        } else {
            buttonStyle === "icon"
                ? (addWishlistIcon.innerHTML = `<div onClick="buttonClick(${selectedId}, ${i}, 'one')" class="icon-collection ${customButton.iconType === "heart" && "heartICON"
                    } ${customButton.iconType === "star" && "starICON"} ${customButton.iconType === "save" && "saveICON"
                    } " ><span class="span-hearticon"></span></div>`)
                : (addWishlistIcon.innerHTML = `<div onClick="buttonClick(${selectedId}, ${i}, 'one')" class="button-collection" style="background-color: ${customButton.bgColor}; color: ${customButton.textColor}" >${customLanguage.addToWishlist}</div>`);
        }
        getMainDiv[i].innerHTML = addWishlistIcon.innerHTML;
    }
}

var quickViewButton = document.querySelectorAll(".quick-add__submit");
for (var i = 0; i < quickViewButton.length; i++) {
    quickViewButton[i].addEventListener("click", () => {
        setTimeout(() => {
            quickViewFxn();
        }, [1000]);
    });
}

async function getCurrentLoginFxn() {
    let currentEmail;
    if (
        localStorage.getItem("customer-email") !== null &&
        localStorage.getItem("customer-email") !== ""
    ) {
        currentEmail = localStorage.getItem("customer-email");
        // localStorage.setItem("access-token", "");
    } else if (
        customerEmail !== "" &&
        localStorage.getItem("customer-email") !== customerEmail
    ) {
        currentEmail = customerEmail;
        // localStorage.setItem("access-token", "");
    } else {
        currentEmail = "";
    }
    return currentEmail;
}

function isInPartialDomain(url, partialDomain) {
    const escapedPartialDomain = partialDomain.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`^(https?:\\/\\/)?(www\\.)?.*${escapedPartialDomain}.*$`, "i");
    return regex.test(url);
}

async function checkCustomCodeProduct() {
    const getAllWishlistDiv = document.querySelectorAll(".wf-wishlist");
    const allHandler = Array.from(getAllWishlistDiv, (wishlistDiv) =>
        wishlistDiv.getAttribute("product-id")
    ).filter(Boolean);
    const finalStoredData = parseInt(checkAllProduct.getAttribute("data-aj"));
    if (parseInt(finalStoredData) !== allHandler.length) {
        checkAllProduct.setAttribute("data-aj", allHandler.length);
        checkAllProduct.setAttribute(
            "data-product-handle",
            JSON.stringify(allHandler)
        );
    } else {
        let checkProductHandle = JSON.parse(
            checkAllProduct.getAttribute("data-product-handle")
        );
        const checkDataExist = await checkIdIncluded(
            checkProductHandle,
            allHandler
        );
        if (!checkDataExist) {
            checkAllProduct.setAttribute("data-aj", allHandler.length);
            checkAllProduct.setAttribute(
                "data-product-handle",
                JSON.stringify(allHandler)
            );
        } else {
            const wfWishlist = document.querySelectorAll(".icon-collection");
            if (wfWishlist.length === 0 && allHandler.length !== 0) {
                checkAllProduct.setAttribute("data-aj", "0");
                checkAllProduct.setAttribute("data-product-handle", []);
                checkAllProduct.setAttribute("data-aj", allHandler.length);
                checkAllProduct.setAttribute(
                    "data-product-handle",
                    JSON.stringify(allHandler)
                );
            }
        }
    }
}

async function checkCustomCodeButton() {
    const getAllWishlistDiv = document.querySelectorAll(".wf-wishlist-button");
    const allHandler = Array.from(getAllWishlistDiv, (wishlistDiv) =>
        wishlistDiv.getAttribute("product-id")
    ).filter(Boolean);
    const finalStoredData = parseInt(checkButtonProduct.getAttribute("data-aj"));
    if (finalStoredData !== allHandler.length) {
        checkButtonProduct.setAttribute("data-aj", allHandler.length);
        checkButtonProduct.setAttribute("data-product-handle", JSON.stringify(allHandler));
    } else {
        let checkProductHandle = JSON.parse(
            checkButtonProduct.getAttribute("data-product-handle")
        );
        const checkDataExist = await checkIdIncluded(
            checkProductHandle,
            allHandler
        );
        if (!checkDataExist) {
            checkButtonProduct.setAttribute("data-aj", allHandler.length);
            checkButtonProduct.setAttribute(
                "data-product-handle",
                JSON.stringify(allHandler)
            );
        } else {
            const wfButtonWishlist = document.querySelectorAll(".button-collection");
            if (wfButtonWishlist.length === 0 && allHandler.length !== 0) {
                checkButtonProduct.setAttribute("data-aj", "0");
                checkButtonProduct.setAttribute("data-product-handle", []);
                checkButtonProduct.setAttribute("data-aj", allHandler.length);
                checkButtonProduct.setAttribute(
                    "data-product-handle",
                    JSON.stringify(allHandler)
                );
            }
        }
    }
}

function checkIdIncluded(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    const idsSet = new Set(arr2.map((obj) => obj.id));
    for (let i = 0; i < arr1.length; i++) {
        if (!idsSet.has(arr1[i].id)) {
            return false;
        }
    }
    return true;
}

async function getSharedWishlistData(userId) {
    try {
        const userData = await fetch(`${serverURL}/get-shared-wishlist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                shopName: permanentDomain,
                customerEmail: userId,
                shopDomain: shopDomain,
            }),
        });
        let result = await userData.json();
        if (result.msg === "get_shared_wishlist") {
            let allData = result.data;
            return allData;
        } else {
            document.querySelector(".show-shared-wishlist").innerHTML = "There is no item";
        }
    } catch (error) {
        console.log("errr ", error);
    }
}

async function showWishlistButtonType() {
    let mediaQuery;
    if (getThemeName?.themeName === "Berlin") {
        mediaQuery = window.matchMedia("(max-width: 1200px)");
    } else {
        mediaQuery = window.matchMedia("(max-width: 1024px)");
    }
    const getThemeSelector = await detechThemeName();
    let modifiedString = getThemeName?.themeName?.replace(/ /g, "_");
    modifiedString = modifiedString?.toLowerCase();
    if (currentPlan >= 1) {
        if (
            generalSetting.wlbLocation3 === true &&
            generalSetting.wlbLocationSelect === "floating-heart-mid-left"
        ) {
            let heartDiv = document.getElementById("heart");
            const div = document.createElement("div");
            div.innerHTML = `<div class="wf-floating-launcher" onClick="heartButtonHandle()"  style="z-indeX: 99; cursor: pointer; background-color: ${generalSetting.floatingHeartBGcolor
                }; border-radius: ${generalSetting.floatingBgShape === "circleBG" ? "50%" : "0%"
                };" id="wf-float-heart-mid-left"><div style="filter: ${generalSetting.floatingHeartIconcolor
                }"  id="heart-icon-mid-left" class="floating-heart ${customButton.iconType === "heart" && "heartICON2"
                } ${customButton.iconType === "star" && "starICON2"} ${customButton.iconType === "save" && "saveICON2"
                } "><span></span></div><span class="count-span fi-count"></span></div>`;
            heartDiv.after(div);
        } else if (
            generalSetting.wlbLocation3 === true &&
            generalSetting.wlbLocationSelect === "floating-heart-mid-right"
        ) {
            let heartDiv = document.getElementById("heart");
            const div = document.createElement("div");
            div.innerHTML = `<div class="wf-floating-launcher" onClick="heartButtonHandle()"  style="z-indeX: 99; cursor: pointer; background-color: ${generalSetting.floatingHeartBGcolor
                }; border-radius: ${generalSetting.floatingBgShape === "circleBG" ? "50%" : "0%"
                };" id="wf-float-heart-mid-right"><div style="filter: ${generalSetting.floatingHeartIconcolor
                }" id="heart-icon-mid-right" class="floating-heart ${customButton.iconType === "heart" && "heartICON2"
                } ${customButton.iconType === "star" && "starICON2"} ${customButton.iconType === "save" && "saveICON2"
                }" ><span> </span></div><span class="count-span fi-count"></span></div>`;
            heartDiv.after(div);
        } else if (
            generalSetting.wlbLocation3 === true &&
            generalSetting.wlbLocationSelect === "floating-heart-bottom-right"
        ) {
            let heartDiv = document.getElementById("heart");
            const div = document.createElement("div");
            div.innerHTML = `<div class="wf-floating-launcher" onClick="heartButtonHandle()"  style="z-indeX: 99; cursor: pointer; background-color: ${generalSetting.floatingHeartBGcolor
                }; border-radius: ${generalSetting.floatingBgShape === "circleBG" ? "50%" : "0%"
                };" id="wf-float-heart-bottom-right"><div style="filter: ${generalSetting.floatingHeartIconcolor
                }" id="heart-icon-bottom-right" class="floating-heart ${customButton.iconType === "heart" && "heartICON2"
                } ${customButton.iconType === "star" && "starICON2"} ${customButton.iconType === "save" && "saveICON2"
                }" ><span> </span></div><span class="count-span fi-count"></span></div>`;
            heartDiv.after(div);
        } else if (
            generalSetting.wlbLocation3 === true &&
            generalSetting.wlbLocationSelect === "floating-heart-bottom-left"
        ) {
            let heartDiv = document.getElementById("heart");
            const div = document.createElement("div");
            div.innerHTML = `<div class="wf-floating-launcher" onClick="heartButtonHandle()"  style="z-indeX: 99; cursor: pointer; background-color: ${generalSetting.floatingHeartBGcolor
                }; border-radius: ${generalSetting.floatingBgShape === "circleBG" ? "50%" : "0%"
                };" id="wf-float-heart-bottom-left"><div  style="filter: ${generalSetting.floatingHeartIconcolor
                }" id="heart-icon-bottom-left" class="floating-heart ${customButton.iconType === "heart" && "heartICON2"
                } ${customButton.iconType === "star" && "starICON2"} ${customButton.iconType === "save" && "saveICON2"
                }" ><span> </span></div><span class="count-span fi-count"></span></div>`;
            heartDiv.after(div);
        }
        if (generalSetting.wlbLocation1 === true) {
            let wishlistWithIcon = `<a style="position:"relative" onClick="heartButtonHandle()" class="menu-drawer__menu-item list-menu__item link link--text focus-inset"><div class="red-heart ${customButton.iconType === "star"
                ? generalSetting.headerIconType === "fillHeaderIcon"
                    ? "starICON2"
                    : generalSetting.headerIconType === "outlineHeaderIcon"
                        ? "starICON"
                        : "starICON"
                : ""
                } ${customButton.iconType === "save"
                    ? generalSetting.headerIconType === "fillHeaderIcon"
                        ? "saveICON2"
                        : generalSetting.headerIconType === "outlineHeaderIcon"
                            ? "saveICON"
                            : "saveICON"
                    : ""
                } ${customButton.iconType === "heart"
                    ? generalSetting.headerIconType === "fillHeaderIcon"
                        ? "heartICON2"
                        : generalSetting.headerIconType === "outlineHeaderIcon"
                            ? "heartICON"
                            : "heartICON"
                    : ""
                } "> <span></span></div><span style="position: absolute; top: 5px; right: 25px "class="count-span"></span>${customLanguage?.headerMenuWishlist ||
                storeFrontDefLang?.headerMenuWishlist || "Wishlist"
                }</a>`;

            let wishlistDesktopHtml = `<a onClick="heartButtonHandle()" class="${getThemeSelector.headerMenuItemClass
                }">${customLanguage?.headerMenuWishlist ||
                storeFrontDefLang?.headerMenuWishlist || "Wishlist"
                }</a>`;

            let wishlistMobileHtml = `<a onClick="heartButtonHandle()" class="${getThemeSelector.headerMenuItemMobileClass
                }">${customLanguage?.headerMenuWishlist ||
                storeFrontDefLang?.headerMenuWishlist || "Wishlist"
                }</a>`;

            function wgMenuItemFxn(mediaQuery) {
                const menuItemMobileClass = `wg-${modifiedString}-menuItem-mobile`;
                const menuItemDesktopClass = `wg-${modifiedString}-menuItem-desktop`;
                const desktopElement = document.querySelector(`.${menuItemDesktopClass}`);
                const mobileElement = document.querySelector(`.${menuItemMobileClass}`);
                let newMobileElement;
                if (typeof getThemeSelector.headerMenuItemMobileCreateElement !== "undefined" && typeof getThemeSelector.headerMenuItemMobileCreateElement !== undefined && typeof getThemeSelector.headerMenuItemMobileCreateElement !== "null" && getThemeSelector.headerMenuItemMobileCreateElement !== "") {
                    newMobileElement = document.createElement(getThemeSelector.headerMenuItemMobileCreateElement);
                } else {
                    newMobileElement = document.createElement("li");
                }
                newMobileElement.className = `${menuItemMobileClass} ${getThemeSelector.headerMenuMobileElementClass}`;
                if (desktopElement) {
                    const computedStyle = window.getComputedStyle(desktopElement);
                    const displayValue = computedStyle.getPropertyValue("display");
                    if (getThemeName?.themeName === "Showcase" || getThemeName?.themeName === "Ella" || getThemeName?.themeName === "Vendy Shopping") {
                        if (displayValue === "none") {
                            desktopElement.style.display = "inline-block";
                        }
                    } else {
                        if (displayValue === "none") {
                            desktopElement.style.display = "block";
                        }
                    }
                }
                if (
                    !document.querySelector(`.${menuItemDesktopClass}`) &&
                    getThemeSelector.headerMenuItem.trim() !== ""
                ) {
                    let menuItemMainElement = document.querySelector(
                        getThemeSelector.headerMenuItem
                    );
                    if (menuItemMainElement) {
                        let newCreateDekstopElement;
                        if (
                            typeof getThemeSelector.headerMenuItemCreateElement !==
                            "undefined" &&
                            getThemeSelector.headerMenuItemCreateElement !== undefined &&
                            typeof getThemeSelector.headerMenuItemCreateElement !== "null" &&
                            getThemeSelector.headerMenuItemCreateElement !== ""
                        ) {
                            newCreateDekstopElement = document.createElement(
                                getThemeSelector.headerMenuItemCreateElement
                            );
                        } else {
                            newCreateDekstopElement = document.createElement("li");
                        }
                        newCreateDekstopElement.className = `${menuItemDesktopClass} ${getThemeSelector.headerMenuElementClass}`;
                        newCreateDekstopElement.innerHTML = wishlistDesktopHtml;
                        if (getThemeSelector.headerMenuElementInsertAfter) {
                            menuItemMainElement.after(newCreateDekstopElement);
                        } else {
                            menuItemMainElement.appendChild(newCreateDekstopElement);
                        }
                    }
                }
                if (mediaQuery.matches) {
                    if (mobileElement) {
                        const computedStyle = window.getComputedStyle(mobileElement);
                        const displayValue = computedStyle.getPropertyValue("display");
                        if (displayValue === "none") {
                            mobileElement.style.display = "block";
                        }
                    }
                    if (
                        getThemeSelector.headerMenuItemMobile !== "" &&
                        !document.querySelector(`.${menuItemMobileClass}`)
                    ) {
                        const element = document.querySelector(`.${menuItemDesktopClass}`);
                        if (element) {
                            element.style.display = "none";
                        }
                        var mainMobileSelector = document.querySelector(
                            getThemeSelector.headerMenuItemMobile
                        );
                        if (mainMobileSelector) {
                            newMobileElement.innerHTML =
                                getThemeName?.themeName === "Ella" ||
                                    getThemeName?.themeName === "Vendy Shopping"
                                    ? wishlistWithIcon
                                    : wishlistMobileHtml;
                            if (getThemeSelector.headerMenuMobileInsertAfter) {
                                mainMobileSelector.after(newMobileElement);
                            } else {
                                mainMobileSelector.appendChild(newMobileElement);
                            }
                        }
                    }

                    if (permanentDomain === "luxapolish.myshopify.com") {
                        let targetDiv = document.querySelectorAll('.wg-prestige-headerIcon-mobile');
                        if (targetDiv.length > 0) {
                            targetDiv.forEach((element, index) => {
                                if (index > 0) {
                                    element.remove();
                                }
                            });
                            let appendToDiv = document.querySelector('.localization-selectors');
                            if (appendToDiv) {
                                appendToDiv.insertAdjacentElement('afterend', targetDiv[0]);
                            }
                        }
                    }
                }
            }
            mediaQuery.addEventListener("change", wgMenuItemFxn);
            wgMenuItemFxn(mediaQuery);
            if (permanentDomain === "luxapolish.myshopify.com") {
                let targetDiv = document.querySelectorAll('.wg-prestige-headerIcon-mobile');
                if (targetDiv.length > 0) {
                    targetDiv.forEach((element, index) => {
                        if (index > 0) {
                            element.remove();
                        }
                    });
                    let appendToDiv = document.querySelector('.localization-selectors');
                    if (appendToDiv) {
                        appendToDiv.insertAdjacentElement('afterend', targetDiv[0]);
                    }
                }
            }
        }
        if (generalSetting.wlbLocation2 === true) {
            if (getThemeName?.themeName === "Local") {
                var elements = document.querySelectorAll(
                    ".header-actions:not(:empty).header-actions--show-search"
                );
                let mobileHeader = document.querySelector(
                    `.wg-local-headerIcon-mobile`
                );
                if (mobileHeader) {
                    mobileHeader.style.order = "2";
                }
                elements.forEach(function (element) {
                    element.style.alignItems = "center";
                });
            } else if (getThemeName?.themeName === "Combine") {
                const checkcombineele = document.querySelector(
                    ".header__top .area--cart"
                );
                checkcombineele.style.gridArea = "inherit";
            }
            function headerIconFxn(mediaQuery) {
                const headerIconDesktopClass = `wg-${modifiedString}-headerIcon-desktop`;
                const headerIconMobileClass = `wg-${modifiedString}-headerIcon-mobile`;
                const iconAppend = `<div onClick="heartButtonHandle()" class="header-heart-position ${getThemeSelector.headerHeartIconMobileClass
                    }" > <div class="red-heart  ${customButton.iconType === "star"
                        ? generalSetting.headerIconType === "fillHeaderIcon"
                            ? "starICON2"
                            : generalSetting.headerIconType === "outlineHeaderIcon"
                                ? "starICON"
                                : "starICON"
                        : ""
                    } ${customButton.iconType === "save"
                        ? generalSetting.headerIconType === "fillHeaderIcon"
                            ? "saveICON2"
                            : generalSetting.headerIconType === "outlineHeaderIcon"
                                ? "saveICON"
                                : "saveICON"
                        : ""
                    } ${customButton.iconType === "heart"
                        ? generalSetting.headerIconType === "fillHeaderIcon"
                            ? "heartICON2"
                            : generalSetting.headerIconType === "outlineHeaderIcon"
                                ? "heartICON"
                                : "heartICON"
                        : ""
                    } "  ><span></span> </div>   <span class="count-span"> </span> </div>`;
                const element = document.querySelector(`.${headerIconDesktopClass}`);
                if (element) {
                    const computedStyle = window.getComputedStyle(element);
                    const displayValue = computedStyle.getPropertyValue("display");
                    if (displayValue === "none") {
                        element.style.display = "block";
                    }
                }
                let mobileHeader = document.querySelector(`.${headerIconMobileClass}`);
                if (mobileHeader) {
                    mobileHeader.style.display = "none";
                }
                if (getThemeSelector.headerHeartElementInsertAfter) {
                    if (!document.querySelector(`.${headerIconDesktopClass}`)) {
                        let headerMainIconElement = document.querySelector(
                            getThemeSelector.headerHeartIcon
                        );
                        if (headerMainIconElement) {
                            let createNewElementDiv;
                            if (
                                typeof getThemeSelector.headerHeartIconCreateElement !==
                                "undefined" &&
                                typeof getThemeSelector.headerHeartIconCreateElement !==
                                "null" &&
                                getThemeSelector.headerHeartIconCreateElement !== undefined &&
                                getThemeSelector.headerHeartIconCreateElement !== ""
                            ) {
                                createNewElementDiv = document.createElement(
                                    getThemeSelector.headerHeartIconCreateElement
                                );
                            } else {
                                createNewElementDiv = document.createElement("div");
                            }
                            createNewElementDiv.className = `${headerIconDesktopClass} ${getThemeSelector.headerHeartElementClass} `;
                            createNewElementDiv.innerHTML = iconAppend;
                            headerMainIconElement.after(createNewElementDiv);
                        }
                    }
                } else {
                    if (
                        !document.querySelector(`.${headerIconDesktopClass}`) &&
                        getThemeSelector.headerHeartIcon !== ""
                    ) {
                        let headerMainIconElement = document.querySelector(
                            getThemeSelector.headerHeartIcon
                        );
                        if (headerMainIconElement) {
                            let createNewElementDiv;
                            if (
                                typeof getThemeSelector.headerHeartIconCreateElement !==
                                "undefined" &&
                                typeof getThemeSelector.headerHeartIconCreateElement !==
                                "null" &&
                                typeof getThemeSelector.headerHeartIconCreateElement !==
                                undefined &&
                                getThemeSelector.headerHeartIconCreateElement !== ""
                            ) {
                                createNewElementDiv = document.createElement(
                                    getThemeSelector.headerHeartIconCreateElement
                                );
                            } else {
                                createNewElementDiv = document.createElement("div");
                            }
                            createNewElementDiv.className = `${headerIconDesktopClass} ${getThemeSelector.headerHeartElementClass}`;
                            createNewElementDiv.innerHTML = iconAppend;
                            headerMainIconElement.appendChild(createNewElementDiv);
                        }
                    }
                }
                if (mediaQuery.matches) {
                    let mobileHeader = document.querySelector(
                        `.${headerIconMobileClass}`
                    );
                    if (mobileHeader) {
                        mobileHeader.style.display = "block";
                    }
                    if (
                        getThemeSelector.headerHeartIconMobile &&
                        !document.querySelector(`.${headerIconMobileClass}`)
                    ) {
                        const className = headerIconDesktopClass;
                        const element = document.querySelector(
                            `.${headerIconDesktopClass}`
                        );
                        if (element) {
                            element.style.display = "none";
                        }
                        let getSelector = document.querySelector(
                            getThemeSelector.headerHeartIconMobile
                        );
                        let createNewElementDiv;
                        if (
                            typeof getThemeSelector.headerHeartIconMobileCreateElement !==
                            "undefined" &&
                            typeof getThemeSelector.headerHeartIconMobileCreateElement !==
                            "null" &&
                            getThemeSelector.headerHeartIconMobileCreateElement !==
                            undefined &&
                            getThemeSelector.headerHeartIconMobileCreateElement !== ""
                        ) {
                            createNewElementDiv = document.createElement(
                                getThemeSelector.headerHeartIconMobileCreateElement
                            );
                        } else {
                            createNewElementDiv = document.createElement("div");
                        }
                        createNewElementDiv.className = `${headerIconMobileClass} ${getThemeSelector.headerHeartMobileElementClass}`;
                        createNewElementDiv.innerHTML = iconAppend;
                        if (getThemeSelector.headerHeartMobileInsertAfter) {
                            getSelector.after(createNewElementDiv);
                        } else {
                            getSelector.appendChild(createNewElementDiv);
                        }
                    }
                    if (permanentDomain === "luxapolish.myshopify.com") {

                        let targetDiv = document.querySelectorAll('.wg-prestige-headerIcon-desktop');
                        if (targetDiv.length > 0) {
                            targetDiv.forEach((element, index) => {
                                if (index > 0) {
                                    element.remove();
                                }
                            });
                            let appendToDiv = document.querySelector('.localization-selectors');
                            if (appendToDiv) {
                                appendToDiv.insertAdjacentElement('afterend', targetDiv[0]);
                            }
                        }
                    }
                }
                headerIconStyle();
            }
            headerIconStyle();
            mediaQuery.addEventListener("change", headerIconFxn);
            headerIconFxn(mediaQuery);
            if (permanentDomain === "luxapolish.myshopify.com") {
                let targetDiv = document.querySelectorAll('.wg-prestige-headerIcon-desktop');
                if (targetDiv.length > 0) {
                    targetDiv.forEach((element, index) => {
                        if (index > 0) {
                            element.remove();
                        }
                    });
                    let appendToDiv = document.querySelector('.localization-selectors');
                    if (appendToDiv) {
                        appendToDiv.insertAdjacentElement('afterend', targetDiv[0]);
                    }
                }
            }
        }
        if (currentPlan > 1) {
            if (generalSetting.paidWlbLocation === "yes") {
                let getCustomDiv = document.querySelector(".custom-wishlist-icon");
                if (getCustomDiv !== null) {

                    let iconType = getCustomDiv.getAttribute("wishlist-type");
                    // console.log("hhhh ... ", iconType)
                    if (iconType === "text") {
                        getCustomDiv.innerHTML = `<a onClick="heartButtonHandle()" >${customLanguage?.headerMenuWishlist || storeFrontDefLang?.headerMenuWishlist || "Wishlist"}</a>`
                    } else {
                        getCustomDiv.innerHTML = `<div onClick="heartButtonHandle()" class="header-heart-position ${getThemeSelector.headerHeartIconMobileClass
                            }" > <div class="red-heart  ${customButton.iconType === "star"
                                ? generalSetting.headerIconType === "fillHeaderIcon"
                                    ? "starICON2"
                                    : generalSetting.headerIconType === "outlineHeaderIcon"
                                        ? "starICON"
                                        : "starICON"
                                : ""
                            } ${customButton.iconType === "save"
                                ? generalSetting.headerIconType === "fillHeaderIcon"
                                    ? "saveICON2"
                                    : generalSetting.headerIconType === "outlineHeaderIcon"
                                        ? "saveICON"
                                        : "saveICON"
                                : ""
                            } ${customButton.iconType === "heart"
                                ? generalSetting.headerIconType === "fillHeaderIcon"
                                    ? "heartICON2"
                                    : generalSetting.headerIconType === "outlineHeaderIcon"
                                        ? "heartICON"
                                        : "heartICON"
                                : ""
                            } "  ><span></span> </div>   <span class="count-span"> </span> </div>`;
                    }
                }
            }
        }
        headerIconStyle();
    }
}

async function handleSearchData(event) {
    const searchValue = event.target.value.trim().toLowerCase();
    const wishlistItems = document.querySelectorAll(".wishlist-grid1");
    let matchCount = 0;
    wishlistItems.forEach((item) => {
        const title = item.querySelector(".title11 a")?.textContent.toLowerCase() || "";
        const price = item.querySelector(".product-option-price")?.textContent.toLowerCase() || "";
        const variant = item.querySelector(".product-selected-variants")?.textContent.toLowerCase() || "";
        const isMatch = title.includes(searchValue) || price.includes(searchValue) || variant.includes(searchValue);
        if (isMatch || searchValue === "") {
            item.style.display = "block";
            matchCount++;
        } else {
            item.style.display = "none";
        }
    });
    if (matchCount === 0) {
        document.querySelector(".wishlist-modal-all").style.display = "none";
        document.querySelector(".modal-button-div").style.display = "none";
        document.querySelector(".wg-no-match-found").style.display = "block";
        document.querySelector(".wg-no-match-found").innerHTML = `<h4 class="drawer-cart-empty">${customLanguage.noFoundSearchText}</h4>`;
        document.querySelector(".grid-option").style.pointerEvents = "none";
    } else {
        document.querySelector(".wishlist-modal-all").style.display = "grid";
        document.querySelector(".modal-button-div").style.display = "block";
        document.querySelector(".wg-no-match-found").style.display = "none";
        document.querySelector(".wg-no-match-found").innerHTML = "";
        document.querySelector(".grid-option").style.pointerEvents = "auto";
    }
}

async function gridFxn(count) {
    document.querySelectorAll(".wf-active-grid-focus").forEach(gridElement => { gridElement.classList.remove("wf-active-grid-focus") });
    document.querySelectorAll(`.grid${count}`).forEach(gridElement => { gridElement.classList.add("wf-active-grid-focus") });
    localStorage.setItem("grid-count", count);
    let addNewClass;
    switch (count) {
        case "1":
            addNewClass = "wishlist-modal-1";
            break;
        case "2":
            addNewClass = "wishlist-modal-2";
            break;
        case "3":
            addNewClass = "wishlist-modal-3";
            break;
        default:
            addNewClass = "wishlist-modal-4";
    }
    document.querySelectorAll(".wishlist-modal-box").forEach(card => {
        card.className = "wishlist-modal-box";
        card.classList.add(addNewClass);
    });
}

const showCountAll = async () => {
    const [list, defaultLang, multiData] = await Promise.all([
        getDataFromSql(),
        getDefLanguage(),
        isMultiwishlistTrue && getMultiwishlistData("")
    ]);
    storeFrontDefLang = defaultLang;
    multiArray = multiData
    const totalObjects = await getCount(list)
    const countHtml = `<span class="show-count"><b>${totalObjects}</b></span>`;
    document.querySelectorAll(".count-span").forEach((countDiv) => {
        countDiv.innerHTML = countHtml;
    });
};

async function getCount(arrayData) {
    if (isMultiwishlistTrue) {
        return totalObjects = arrayData.reduce(
            (count, obj) =>
                count + Object.values(obj).reduce((sum, arr) => sum + arr.length, 0),
            0
        );
    } else {
        const newArray = await findArrayByKey(arrayData, "favourites");
        return totalObjects = newArray.length;
    }
}

document.addEventListener("keyup", function (e) {
    if (e.key === "Escape") {
        modalLink.style.display = "none";
        getMultiWishlistDiv && (getMultiWishlistDiv.style.display = "none");
        checkedItems = [];
        nonCheckedItems = [];
    }
});

function handleClick(event) {
    if (event.target === modalLink) {
        if (typeof modalLink !== "undefined" && modalLink !== null) {
            modalLink.style.display = "none";
        }
    } else if (event.target === modalWF) {
        if (typeof modalWF !== "undefined" && modalWF !== null) {
            modalWF.style.display = "none";
        }
    } else if (event.target === modalDrawer) {
        if (typeof modalDrawer !== "undefined" && modalDrawer !== null) {
            modalDrawer.style.display = "none";
        }
    } else if (event.target === shareModal) {
        if (typeof shareModal !== "undefined" && shareModal !== null) {
            shareModal.style.display = "none";
        }
    }
    if (event.target === getMultiWishlistDiv) {
        if (
            typeof getMultiWishlistDiv !== "undefined" &&
            getMultiWishlistDiv !== null
        ) {
            getMultiWishlistDiv.style.display = "none";
            checkedItems = [];
            nonCheckedItems = [];
        }
    }
}
document.addEventListener("click", handleClick);

function checkButton() {
    const customerEmail = localStorage.getItem("customer-email");
    if (customerEmail === null || customerEmail === "") {
        const shareModalElement = document.querySelectorAll(
            "button.shareModalById"
        );
        for (let i = 0; i < shareModalElement.length; i++) {
            const shareModalCheck = shareModalElement[i];
            shareModalCheck.disabled = true;
            shareModalCheck.style.cursor = "not-allowed";
            shareModalCheck.style.backgroundColor = "#ccc";
        }
        return true;
    } else {
        return false;
    }
}

async function drawerHandler() {
    if (shopDomain === "wishlist-guru.myshopify.com") {
        let loaderr = document.querySelectorAll(".show-title");
        for (let i = 0; i < loaderr.length; i++) {
            loaderr[i].innerHTML = `<div class="loader-css" ><span> </span></div>`;
        }
        document.querySelector(
            ".drawer-main"
        ).innerHTML = `<div class="loader-css" ><span> </span></div>`;
        document.querySelector(".sidenav").style.transform = "translateX(0%)";
        document.querySelector(".overlayy").style.height = "100vh";
        renderDrawerContentFxn();
    }
}

async function modalHandler() {
    if (shopDomain === "wishlist-guru.myshopify.com") {
        modalWF.style.display = "block";
        spanWF.onclick = function () {
            modalWF.style.display = "none";
        };
        pageTypeFunction();
    }
}

function closeNav() {
    document.querySelector(".sidenav").style.transform = "translateX(100%)";
    document.querySelector(".overlayy").style.height = "0vh";
}

function wishlistStyleFxn() {
    if (generalSetting.wishlistDisplay === "modal") {
        document.querySelector(".wg-modal-content").style.backgroundColor = generalSetting.wlBgColor;
        document.querySelector(".wg-modal-content").style.padding = `${generalSetting.wlPaddingTopBottom}${generalSetting.wlPaddingTopBottomUnit} ${generalSetting.wlPaddingLeftRight}${generalSetting.wlPaddingLeftRightUnit}`;

        document.getElementById("main-Modal-form").classList.add(
            `${generalSetting.wlTextAlign === "left"
                ? "box-align-left"
                : generalSetting.wlTextAlign === "center"
                    ? "box-align-center"
                    : "box-align-right"
            }`
        );
        document.querySelector(".wg-close").style.filter = generalSetting.wlCrossFilter;
        document.querySelector(".close1").style.filter = generalSetting.wlCrossFilter;
        document.querySelector(".closeByShareModal").style.filter = generalSetting.wlCrossFilter;
        document.querySelector(".wg-modal-content").style.color = modalDrawerTextColor;
        document.querySelector("#wg-myModal h2").style.color = modalDrawerTextColor;
        document.querySelector("div#main-Modal-form").style.textAlign = generalSetting.wlTextAlign;
        document.querySelector(".wg-modal-content").style.maxWidth = `${generalSetting.wlWidthInput}${generalSetting.wlWidthUnit}`;
    }
    if (generalSetting.wishlistDisplay === "drawer") {
        document.querySelector(".sidenav").style.backgroundColor = generalSetting.wlBgColor;
        document.querySelector(".sidenav").style.color = modalDrawerTextColor;
        document.querySelector(".closebtn").style.filter = generalSetting.wlCrossFilter;
        document.querySelector(".close1").style.filter = generalSetting.wlCrossFilter;
        document.querySelector(".closeByShareModal").style.filter = generalSetting.wlCrossFilter;
        document.querySelector(".sidenav").style.maxWidth = `${generalSetting.wlWidthInput}${generalSetting.wlWidthUnit}`;
    }
}
wishlistStyleFxn();

async function heartButtonHandle() {
    if (currentPlan >= 1) {
        let loaderr = document.querySelectorAll(".show-title");
        for (let i = 0; i < loaderr.length; i++) {
            loaderr[i].innerHTML = `<div class="loader-css" ><span></span></div>`;
        }
        document.querySelector(".drawer-main").innerHTML = `<div class="loader-css" ><span></span></div>`;
        if (currentPlan > 1) {
            let poweredByText = document.querySelectorAll(".powered-by-text");
            for (let i = 0; i < poweredByText.length; i++) {
                poweredByText[i].innerHTML = "";
            }
        }
        if (generalSetting.wishlistDisplay === "modal") {
            wishlistStyleFxn();
            modalWF.style.display = "block";
            document.querySelector(".modal-page-auth").style.display = "block";
            document.querySelector(".grid-outer-main").style.display = "flex";
            document.getElementById("wg-modal-inner-content").style.display = "block";
            document.getElementById("wg-isLogin-modal").style.display = "none";
            document.querySelector(".searchData input").value = "";
            spanWF.onclick = function () {
                modalWF.style.display = "none";
                document.querySelector(".searchData input").value = "";
            };
            pageTypeFunction();
        } else if (generalSetting.wishlistDisplay === "page") {
            wishlistStyleFxn();
            window.location = `${wfGetDomain}apps/wg-wishlist`;
        } else if (generalSetting.wishlistDisplay === "drawer") {
            if (currentPlan > 1) {
                document.querySelector(".sidenav").style.transform = "translateX(0%)";
                document.querySelector(".overlayy").style.height = "100vh";
                document.querySelector(".swlb-div").style.display = "block";
                document.querySelector(".drawer-main").style.display = "block";
                document.querySelector(".drawer-button-div").style.display = "block";
                document.getElementById("wg-isLogin-drawer").style.display = "none";
                renderDrawerContentFxn();
            } else {
                alertContent(`Your plan subscription is out of service, Please Contact site administrator`);
            }
        } else {
            window.location = `${wfGetDomain}apps/wg-wishlist`;
        }
    }
}

async function updateQuantity(event, product_id, user_id) {
    try {
        const closestQuantUpdate = event.target.parentNode.querySelector(".quant-update");
        if (!closestQuantUpdate) return;
        const isPlusQuant = event.target.classList.contains("quant-plus");
        const isMinusQuant = event.target.classList.contains("quant-minus");
        let quantity = parseInt(closestQuantUpdate.dataset.quant || 1);
        if (isPlusQuant) {
            quantity++;
        } else if (isMinusQuant && quantity > 1) {
            quantity--;
        } else {
            return;
        }
        const userData = await fetch(`${serverURL}/update-product-quantity`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productId: product_id,
                userId: user_id,
                quantity: quantity,
            }),
        });
        const result = await userData.json();
        if (result.msg === "item_quantity_updated") {
            closestQuantUpdate.textContent = quantity;
            closestQuantUpdate.dataset.quant = quantity;
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function fxnAfterAddToWishlist() {
    setTimeout(() => {
        eval(advanceSetting.jsAfterAddToWishlist);
    }, [1000]);
}

function fxnAfterRemoveFromWishlist() {
    setTimeout(() => {
        eval(advanceSetting.jsAfterRemoveFromWishlist);
    }, [1000]);
}

function fxnAfterItemsLoadedOfWishlist() {
    setTimeout(() => {
        eval(advanceSetting.jsAfterItemsLoaded);
    }, [500]);
}

function addClassInDiv() {
    var elements = document.querySelectorAll(".swlb-div");
    elements.forEach(function (element) {
        element.classList.add("login-text-removed");
    });
    return `<div></div>`;
}

async function shareWishlistFXN() {
    if (
        currentPlan <= 3 &&
        generalSetting.wishlistShareShowData === "loggedinuser"
    ) {
        let checkLoggedIn = await checkButton();
        let shareDIV = document.querySelectorAll(".share-div");
        for (let i = 0; i < shareDIV.length; i++) {
            if (checkLoggedIn === true) {
                shareDIV[i].innerHTML = `<div class="${generalSetting.wishlistDisplay === "drawer"
                    ? "drawerShareTextStyle"
                    : "shareModalById shareButtonStyle"
                    }" ><div class="img_test"><span></span></div><div class="shareButtonTextStyle">${customLanguage.shareWishlistByEmailButton
                    }</div></div>`;
            } else {
                shareDIV[i].innerHTML = `<div class="${generalSetting.wishlistDisplay === "drawer"
                    ? "drawerShareTextStyle"
                    : "shareButtonStyle"
                    }" onclick="openShareWishlistModal()"><div class="img_test"><span></span></div><div class="shareButtonTextStyle">${customLanguage.shareWishlistByEmailButton
                    }</div></div>`;
            }
        }
    } else if (
        currentPlan <= 3 &&
        generalSetting.wishlistShareShowData === "guestuser"
    ) {
        let shareDIV = document.querySelectorAll(".share-div");
        for (let i = 0; i < shareDIV.length; i++) {
            shareDIV[i].innerHTML = `<div class="${generalSetting.wishlistDisplay === "drawer"
                ? "drawerShareTextStyle"
                : "shareButtonStyle"
                }" onclick="openShareWishlistModal()"><div class="img_test"><span></span></div><div class="shareButtonTextStyle">${customLanguage.shareWishlistByEmailButton
                }</div></div>`;
        }
        let getLoginnDiv = customerEmail
            ? addClassInDiv()
            : `<div class="drawer-login-text"> ${customLanguage?.loginTextForWishlist
                ? customLanguage?.loginTextForWishlist
                : "Wishlist is not saved permanently yet. Please"
            } <a href ="/account">${customLanguage?.loginTextAnchor
                ? customLanguage?.loginTextAnchor
                : "login"
            }</a> ${customLanguage?.orText ? customLanguage?.orText : "or"
            } <a href="/account/register"> ${customLanguage?.createAccountAnchor
                ? customLanguage?.createAccountAnchor
                : "create account"
            } </a></div>`;
        document.querySelector(
            ".swlb-div"
        ).innerHTML = `${getLoginnDiv}<div class="${generalSetting.wishlistDisplay === "drawer"
            ? "drawerShareTextStyle"
            : "shareButtonStyle"
        }" onclick="openShareWishlistModal()"><div class="img_test"><span></span></div><div class="shareButtonTextStyle">${customLanguage.shareWishlistByEmailButton
            }</div></div>`;
    } else if (
        currentPlan >= 4 &&
        generalSetting.wishlistShareShowData === "loggedinuser"
    ) {
        let checkLoggedIn = await checkButton();
        let shareDIV = document.querySelectorAll(".share-div");
        for (let i = 0; i < shareDIV.length; i++) {
            if (checkLoggedIn === true) {
                shareDIV[i].innerHTML = `<div class="${generalSetting.wishlistDisplay === "drawer"
                    ? "drawerShareTextStyle"
                    : "shareModalById shareButtonStyle"
                    }"><div class="img_test"><span></span></div><div class="shareButtonTextStyle">${customLanguage.shareWishlistByEmailButton
                    }</div></div>`;
            } else {
                shareDIV[i].innerHTML = `<div class="${generalSetting.wishlistDisplay === "drawer"
                    ? "drawerShareTextStyle"
                    : "shareButtonStyle"
                    }" onclick="openShareModal()"><div class="img_test"><span></span></div><div class="shareButtonTextStyle">${customLanguage.shareWishlistByEmailButton
                    }</div></div>`;
            }
        }
    } else if (
        currentPlan >= 4 &&
        generalSetting.wishlistShareShowData === "guestuser"
    ) {
        let shareDIV = document.querySelectorAll(".share-div");
        for (let i = 0; i < shareDIV.length; i++) {
            shareDIV[i].innerHTML = `<div class="${generalSetting.wishlistDisplay === "drawer"
                ? "drawerShareTextStyle"
                : "shareButtonStyle"
                }"  onclick="openShareModal()"><div class="img_test"><span></span></div><div class="shareButtonTextStyle">${customLanguage.shareWishlistByEmailButton
                }</div></div>`;
        }
        let getLoginnDiv = customerEmail
            ? addClassInDiv()
            : `<div class="drawer-login-text"> ${customLanguage?.loginTextForWishlist
                ? customLanguage?.loginTextForWishlist
                : "Wishlist is not saved permanently yet. Please"
            } <a href ="/account">${customLanguage?.loginTextAnchor
                ? customLanguage?.loginTextAnchor
                : "login"
            }</a> ${customLanguage?.orText ? customLanguage?.orText : "or"
            } <a href="/account/register"> ${customLanguage?.createAccountAnchor
                ? customLanguage?.createAccountAnchor
                : "create account"
            } </a> </div>`;
        document.querySelector(
            ".swlb-div"
        ).innerHTML = `${getLoginnDiv} <div class="${generalSetting.wishlistDisplay === "drawer"
            ? "drawerShareTextStyle"
            : "shareButtonStyle"
        }"  onclick="openShareModal()"><div class="img_test"><span></span></div><div class="shareButtonTextStyle">${customLanguage.shareWishlistByEmailButton
            }</div></div>`;
    }
}

async function showButtons() {
    const getCurrentLogin = await getCurrentLoginFxn();
    const checkVisibility = (setting) => {
        if (!setting) {
            return true;
        } else if (setting === "both users") {
            return true;
        } else if (setting === "login users") {
            return getCurrentLogin !== "";
        } else {
            return false;
        }
    };
    const isPrice = checkVisibility(generalSetting.showPrice);
    const isQuantity = checkVisibility(generalSetting.showQuantity);
    const isMoveToCart = checkVisibility(generalSetting.showMoveToCart);

    return { isPrice, isQuantity, isMoveToCart };
}

function getCurrentLoginFxnForSharedPage() {
    let accessToken;
    if (localStorage.getItem("access-token") === null) {
        // accessToken = (Math.random() + 1).toString(36).substring(2) + new Date();
        accessToken = btoa(
            (Math.random() + 1).toString(36).substring(2) + new Date()
        );
        localStorage.setItem("access-token", accessToken);
    } else {
        accessToken = localStorage.getItem("access-token");
    }
    let accessEmail;
    if (localStorage.getItem("customer-email") === null) {
        accessEmail = customerEmail;
        localStorage.setItem("customer-email", customerEmail);
    } else {
        if (localStorage.getItem("customer-email") === customerEmail) {
            accessEmail = localStorage.getItem("customer-email");
        } else {
            if (
                localStorage.getItem("customer-email") !== "" &&
                customerEmail === ""
            ) {
                accessEmail = localStorage.getItem("customer-email");
            } else {
                if (
                    localStorage.getItem("customer-email") !== "" &&
                    localStorage.getItem("customer-email") !== customerEmail
                ) {
                    accessEmail = customerEmail;
                    localStorage.setItem("customer-email", customerEmail);
                } else {
                    accessEmail = customerEmail;
                    localStorage.setItem("customer-email", customerEmail);
                }
            }
        }
    }
    return { accessToken, accessEmail };
}

function checkShareIcons() {
    return {
        facebookIcon:
            generalSetting?.facebookCheckIcon === undefined
                ? true
                : generalSetting.facebookCheckIcon,
        whatsappIcon:
            generalSetting?.whatsappCheckIcon === undefined
                ? true
                : generalSetting.whatsappCheckIcon,
        linkedinIcon:
            generalSetting?.linkedinCheckIcon === undefined
                ? true
                : generalSetting.linkedinCheckIcon,
        telegramIcon:
            generalSetting?.telegramCheckIcon === undefined
                ? true
                : generalSetting.telegramCheckIcon,
        instagramIcon:
            generalSetting?.instagramCheckIcon === undefined
                ? true
                : generalSetting.instagramCheckIcon,
        twitterIcon:
            generalSetting?.twitterCheckIcon === undefined
                ? true
                : generalSetting.twitterCheckIcon,
        fbMessengerIcon:
            generalSetting?.fbMessengerCheckIcon === undefined
                ? true
                : generalSetting.fbMessengerCheckIcon,
    };
}

function pageTypeStyle() {
    document.querySelector(".wishlist-page-main").style.backgroundColor =
        generalSetting.wlBgColor;
    document.querySelector(
        ".wishlist-page-main"
    ).style.padding = `${generalSetting.wlPaddingTopBottom}${generalSetting.wlPaddingTopBottomUnit} ${generalSetting.wlPaddingLeftRight}${generalSetting.wlPaddingLeftRightUnit}`;
    document
        .querySelector(".wishlist-page-main")
        .classList.add(
            `${generalSetting.wlTextAlign === "left"
                ? "box-align-left"
                : generalSetting.wlTextAlign === "center"
                    ? "box-align-center"
                    : "box-align-right"
            }`
        );
    document.querySelector(".wishlist-page-main").style.color =
        modalDrawerTextColor;
    document.querySelector(".wishlist-page-main").style.textAlign =
        generalSetting.wlTextAlign;
}

function changeMoney(cents) {
    const money_format = heartButton.getAttribute("currency-type");
    if (typeof cents === "string") {
        cents = parseFloat(cents.replace(",", ""));
    }
    var value = "";
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = money_format;
    function defaultOption(opt, def) {
        return typeof opt === "undefined" ? def : opt;
    }
    function formatWithDelimiters(number, precision, thousands, decimal) {
        precision = defaultOption(precision, 2);
        thousands = defaultOption(thousands, ",");
        decimal = defaultOption(decimal, ".");
        if (isNaN(number) || number === null) {
            return "0";
        }
        number = (number / 100.0).toFixed(precision);
        var parts = number.split("."),
            dollars = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1" + thousands),
            cents = parts[1] ? decimal + parts[1] : "";
        return dollars + cents;
    }
    let match = formatString.match(placeholderRegex);
    if (match) {
        switch (match[1]) {
            case "amount":
                value = formatWithDelimiters(cents, 2);
                break;
            case "amount_no_decimals":
                value = formatWithDelimiters(cents, 0);
                break;
            case "amount_with_comma_separator":
                value = formatWithDelimiters(cents, 2, ".", ",");
                break;
            case "amount_no_decimals_with_comma_separator":
                value = formatWithDelimiters(cents, 0, ".", ",");
                break;
        }
    }
    return formatString.replace(placeholderRegex, value);
}


// ---------------filter option function---------------

function createFilterOptionInStructure() {
    // if (generalSetting?.hideFilter !== true) {
    //     let filterMainDiv = document.querySelectorAll('.wg-filter-main-div');
    //     for (let i = 0; i < filterMainDiv.length; i++) {
    //         filterMainDiv[i].innerHTML = `Sort by <select style="float: right;padding: 10px 15px;" id="wf-filter-for-modal" onChange="wfFilterChange()">
    //                                         ${customLanguage?.textMsgLanguage === "english" && `<option value="a_to_z" >Alphabetically, A-Z</option>`}
    //                                         ${customLanguage?.textMsgLanguage === "english" && `<option value="z_to_a" >Alphabetically, Z-A</option>`}
    //                                         <option value="l_to_h" >Price, low to high</option>
    //                                         <option value="h_to_l" >Price, high to low</option>
    //                                         <option value="n_to_o" >Date, new to old</option>
    //                                         <option value="o_to_n" >Date, old to new</option>
    //                                     </select>`;
    //     }
    // }
};

async function wfFilterChange() {
    const selectElement = document.getElementById("wf-filter-for-modal");
    const selectedValue = selectElement.value;
    let arrayList = await getDataFromSql();
    let myArray = [];

    if (isMultiwishlistTrue === false) {
        arrayList.map((data, index) => {
            let keyData = Object.keys(data)[0];
            let valueData = Object.values(data)[0];
            if (keyData === "favourites") {
                if (selectedValue === "a_to_z") {
                    valueData.sort((a, b) => a.title.localeCompare(b.title));
                } else if (selectedValue === "z_to_a") {
                    valueData.sort((a, b) => b.title.localeCompare(a.title));
                } else if (selectedValue === "n_to_o") {
                    valueData.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
                } else if (selectedValue === "o_to_n") {
                    valueData.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
                } else if (selectedValue === "l_to_h") {
                    valueData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                } else if (selectedValue === "h_to_l") {
                    valueData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                }
                myArray.push({ [keyData]: valueData });
            }
        })
    } else {
        arrayList.map((data, index) => {
            let keyData = Object.keys(data)[0];
            let valueData = Object.values(data)[0];
            if (selectedValue === "a_to_z") {
                valueData.sort((a, b) => a.title.localeCompare(b.title));
            } else if (selectedValue === "z_to_a") {
                valueData.sort((a, b) => b.title.localeCompare(a.title));
            } else if (selectedValue === "n_to_o") {
                valueData.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
            } else if (selectedValue === "o_to_n") {
                valueData.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
            } else if (selectedValue === "l_to_h") {
                valueData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            } else if (selectedValue === "h_to_l") {
                valueData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            }
            myArray.push({ [keyData]: valueData });
        })
    }
    renderMultiModalContentFxn(myArray);
}
// ---------------filter option function---------------

async function pageTypeFunction() {
    const defaultLang = await getDefLanguage();
    storeFrontDefLang = defaultLang;
    await getStoreLanguage().then(async () => {
        if (currentPlan > 1) {
            let poweredByText = document.querySelectorAll(".powered-by-text");
            for (let i = 0; i < poweredByText.length; i++) {
                poweredByText[i].innerHTML = "";
            }
        }
        let addModalHeading = document.querySelectorAll(".modal-heading");
        if (addModalHeading.length > 0) {
            for (let i = 0; i < addModalHeading.length; i++) {
                addModalHeading[i].innerHTML = `${customLanguage.modalHeadingText}`;
            }
        }
        let viewTextDiv = document.querySelectorAll(".gridText");
        if (viewTextDiv.length > 0) {
            for (let i = 0; i < viewTextDiv.length; i++) {
                viewTextDiv[i].innerHTML = `${customLanguage.textForGridIcon}`;
            }
        }
        const getLocalId = localStorage.getItem("isLoginProductId") !== null
            ? localStorage.getItem("isLoginProductId")
            : null;

        if (!customerEmail && getLocalId) {
            document.querySelector(".modal-page-auth").style.display = "none";
            document.querySelector(".grid-outer-main").style.display = "none";
            document.querySelector(".show-title").style.display = "none";
            document.querySelector(".modal-button-div").style.display = "none";
            const newDivData = `
        <h3>${customLanguage?.isLoginParaText || storeFrontDefLang.isLoginParaText}</h3>
        <div class="wg-islogin-buttons">
            <button onClick="goToRegister()" class="wg-register-btn">${customLanguage?.createAccountAnchor || storeFrontDefLang.createAccountAnchor}</button>
            <button onClick="goToAccount()" class="wg-login-btn">${customLanguage?.loginTextAnchor || storeFrontDefLang?.loginTextAnchor}</button>
        </div>`;
            const newDiv = document.createElement("div");
            newDiv.id = "wg-isLogin-modal";
            newDiv.innerHTML = newDivData;
            document.querySelector(".modal-button-div").insertAdjacentElement("afterend", newDiv);
            setTimeout(() => {
                localStorage.clear("isLoginProductId");
            }, 15000);
        }
        if (!customerEmail) {
            document.querySelector(".modal-page-auth").innerHTML = `
        ${customLanguage?.loginTextForWishlist || storeFrontDefLang.loginTextForWishlist} <a href ="/account">${customLanguage?.loginTextAnchor || storeFrontDefLang?.loginTextAnchor}</a> ${customLanguage?.orText || storeFrontDefLang.orText} <a href="/account/register"> ${customLanguage?.createAccountAnchor || storeFrontDefLang.createAccountAnchor}</a>`;
            document.querySelector(".modal-page-auth").style.textAlign = generalSetting.wlTextAlign;
        }
        renderViewAs();
        shareWishlistFXN();
        modalButtonFxn();
        const getSearchBar = document.querySelector(".searchbar_Input");
        getSearchBar && (getSearchBar.value = "");
        if (window.location.href.includes("/apps/wg-wishlist")) {
            const arrayList = isMultiwishlistTrue
                ? await getDataFromSql()
                : getWishlistByKey(await getDataFromSql(), "favourites");
            await renderMultiModalContentFxn(arrayList)
        } else {
            checkPlanForMulti("multi")
        }
        shareModalContent.innerHTML = `<h3>${customLanguage.shareWishlistByEmailHeading}</h3>
    <div class="closeByShareModal" aria-hidden="true"  onclick="closeShareModal()"></div>
    <label for="textEmailName">${customLanguage.shareWishlistSenderName}<span class="redAstrik">*</span></label>
    <input type="text" id="textEmailName" name="textEmailName" placeholder="${customLanguage.shareWishlistSenderName}" onfocus="removeError()">

    <label for="textEmailRecieverName">${customLanguage?.shareWishlistRecieverName || storeFrontDefLang?.shareWishlistRecieverName}<span class="redAstrik">*</span></label>
    <input type="text" id="textEmailRecieverName" name="textEmailRecieverName" placeholder="${customLanguage?.shareWishlistRecieverName || storeFrontDefLang?.shareWishlistRecieverName}" onfocus="removeError()">

    <label for="textEmail">${customLanguage.shareWishlistRecipientsEmail}<span class="redAstrik">*</span></label>
    <input type="email" id="textEmail" name="textEmail" placeholder="${customLanguage.shareWishlistRecipientsEmail}" onfocus="removeError()">
    <div id="emailError" class="error-message" style="display: none;"></div>

    <label for="textEmailMessage">${customLanguage.shareWishlistMessage}<span class="redAstrik">*</span></label>
    <textarea id="textEmailMessage" name="textEmailMessage" placeholder="${customLanguage?.shareWishlistMessagePlaceholder || ""}" onfocus="removeError()"></textarea>
    <div id="error-message" style="color: red;"></div>

    <div class="modalContainer">
        <button id="shareListBtn" class="cartButtonStyle" type="button" onclick="submitForm()">${customLanguage.shareWishlistByEmailFormButton}</button> 
    </div>
      
    <div class="other-sharing-options">
      <h4>${customLanguage.iconHeading}</h4>

      <div class="socialMediaIcon">      
        <div onclick="openShareWishlistModal()" class="wg-icon-parent"><span class="copy-link-img share-icons"></span><span class="iconText">Copy</span></div>
      ${checkShareIcons().facebookIcon
                ? `<div onclick="shareOnFacebook()" class="wg-icon-parent"><span class="facebook-img share-icons"></span><span class="iconText">Facebook</span></div>`
                : ""
            }
      ${checkShareIcons().whatsappIcon
                ? `<div onclick="shareViaWhatsApp()" class="wg-icon-parent"><span class="whatsapp-img share-icons"></span><span class="iconText">WhatsApp</span></div>`
                : ""
            }
      ${checkShareIcons().linkedinIcon
                ? `<div onclick="shareViaLinkedIn()" class="wg-icon-parent"><span class="linkedin-img share-icons"></span><span class="iconText">Linkedin</span></div>`
                : ""
            }
      ${checkShareIcons().fbMessengerIcon
                ? `<div onclick="shareOnFbMessenger()" class="wg-icon-parent"><span class="fb-messenger-img share-icons"></span><span class="iconText">Messenger</span></div>`
                : ""
            }
      ${checkShareIcons().telegramIcon
                ? `<div onclick="shareViaTelegram()" class="wg-icon-parent"><span class="telegram-img share-icons"></span><span class="iconText">Telegram</span></div>`
                : ""
            }
      ${checkShareIcons().twitterIcon
                ? `<div onclick="shareOnTwitter()" class="wg-icon-parent"><span class="twitter-img share-icons"></span><span class="iconText">X</span></div>`
                : ""
            }
      ${checkShareIcons().instagramIcon
                ? `<div onclick="shareOnInstagram()" class="wg-icon-parent"><span class="instagram-img share-icons"></span><span class="iconText">Instagram</span></div>`
                : ""
            }
    </div></div>`;
        successInnerDiv.innerHTML = `<p>${customLanguage.shareWishlistByEmailSuccessMsg}</p></div>`;
    })
}

async function renderMultiModalContentFxn(arrayList) {
    shareWishlistFXN();
    if (arrayList.length === 0) {
        await disableShare(arrayList, ".share-div")
        let emptyList = `<h4 class="drawer-cart-empty" > ${customLanguage.noMoreItem} </h4> <a class="a-main" href="${generalSetting?.continueShoppingLink || "/collections/all"}"> <div class="cartButtonStyle"> ${customLanguage.continueShopping || storeFrontDefLang.continueShopping} </div> </a>`;

        document.querySelectorAll(".show-title").forEach((el) => (el.innerHTML = emptyList));
        return
    }
    await disableShare(arrayList, ".share-div")
    const modalHeading = document.querySelector(".modal-heading");
    modalHeading.style.color = modalDrawerTextColor;
    modalHeading.style.textAlign = generalSetting.wlTextAlign;
    const { isPrice, isQuantity, isMoveToCart } = await showButtons();
    let gridCount = localStorage.getItem("grid-count") || "3";
    document
        .querySelectorAll(`.grid${gridCount}`)
        .forEach((el) => el.classList.add("wf-active-grid-focus"));
    const addNewClass = `wishlist-modal-${gridCount}`;
    let wishlistBody = `<div class="wishlist-modal-all">`;
    for (let itemIndex = 0; itemIndex < arrayList.length; itemIndex++) {
        let item = arrayList[itemIndex];
        let key = Object.keys(item)[0];
        let items = item[key];
        wishlistBody += isMultiwishlistTrue ? `<div class="wf-multi-Wish-heading">
                            <div class="wf-multi-Wish-content">
                                <span class="wg-arrow-up" onclick="toggleWishlistBox('${key}')"></span>
                                <h3 data-key="${key}">${key}</h3>
                                <span class="edit-main-icon" onclick="editWishlistName(event, '${key}')">
                                    <span class="editWish"></span>
                                </span>

                                <div class="editWishDiv">
                                    <div class="editWishDivInner">
                                        <input type="text" class="editInput" placeholder="Enter wishlist name" value="${key}">
                                        <div onclick="saveEditWishlistName(event, '${key}')" class="check-icon-main">
                                            <div class="check-multiwishlist-icon"></div>
                                        </div>
                                        <div onclick="closeEditWishlistName(event, '${key}')" class="close-icon-main">
                                            <div class="close-multiwishlist-icon"></div>
                                        </div>
                                    </div>
                                    <p class="errorPara">Please enter name*</p>
                                </div>
                            </div>
                            <span class="delete-main-icon" onclick="deleteWishlist(event, '${key}')">
                                <span class="deleteWish"></span>
                            </span>
                        </div>` : "";


        if (items.length === 0) {
            wishlistBody += `<div class="wishlist-modal-box wf-empty-multiwishlist" data-key="${key}">
                                <h4 class="drawer-cart-empty">${customLanguage.noMoreItem}</h4>
                                <a class="a-main" href="${generalSetting?.continueShoppingLink || "/collections/all"}">
                                    <div class="cartButtonStyle">${customLanguage?.addProductButtonText || storeFrontDefLang?.addProductButtonText}</div>
                                </a>
                            </div>`;
            continue;
        }
        wishlistBody += `<div class="wishlist-modal-box ${addNewClass}" data-key="${key}">`
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            let data = items[itemIndex];
            let response = null;
            let jsonData;
            let foundVariant;
            let hasTag = false;

            if (permanentDomain !== '00b979.myshopify.com' && data?.variant_id !== "") {
                response = await fetch(`${wfGetDomain}variants/${data.variant_id}.js`);
                if (response.status !== 404) {
                    foundVariant = await response?.json();
                }
            }
            // else if (permanentDomain === 'l-a-girl-cosmetics.myshopify.com') {
            //     response = await fetch(`${wfGetDomain}pages/${data.variant_id}786.js`);
            //     foundVariant = await response.json();
            // }
            else {
                response = await fetch(`${wfGetDomain}products/${data.handle}.js`);
                if (response.status !== 404) {
                    jsonData = await response?.json();
                    foundVariant = jsonData?.variants.find(v => Number(v.id) === Number(data.variant_id));
                    hasTag = jsonData?.tags?.includes("wg_pdp") || false;
                }
            }

            // const response = await fetch(`${wfGetDomain}variants/${data.variant_id}.js`);
            // const response = await fetch(`${wfGetDomain}products/${data.handle}.js`);
            if (response.ok) {
                // const jsonData = await response.json();
                // const foundVariant = jsonData.variants.find(v => Number(v.id) === Number(data.variant_id));
                // const hasTag = jsonData?.tags?.includes("wg_pdp") || false;
                // const foundVariant = await response.json();
                const variantArray = [
                    foundVariant?.option1,
                    foundVariant?.option2,
                    foundVariant?.option3,
                ]?.filter((option) => option && option !== "Default Title");

                let actualPrice = foundVariant?.compare_at_price
                    ? changeMoney(foundVariant?.compare_at_price)
                    : null;
                const salePrice = changeMoney(foundVariant?.price);

                let currentNewPrice = foundVariant?.compare_at_price && foundVariant?.compare_at_price > foundVariant?.price
                    ? `<div class="wf-sale-price">${actualPrice}</div> 
                        <div class="wf-discount-price">${salePrice}</div>
                        <span class="Polaris-Sale-Text--root Polaris-Text--bodySm">
                            ${customLanguage.saleText || storeFrontDefLang.saleText}</span>`
                    : salePrice;

                const modifiedString = data.title
                    .replace(/'/g, "/wg-sgl")
                    .replace(/"/g, "/wg-dbl");

                const variantNAME = currentPlan >= 4 ? foundVariant?.name : data.title;
                const variantData = variantArray.length > 0 ? variantArray.join(" / ") : "";
                const priceToDb =
                    foundVariant?.compare_at_price &&
                        foundVariant?.compare_at_price > foundVariant?.price
                        ? foundVariant?.price
                        : foundVariant?.compare_at_price || foundVariant?.price;

                wishlistBody += `<div class="wishlist-grid1">
                        ${isMultiwishlistTrue
                        ? `
                            <div class="copy-icon-main" onClick="copyItem(${data.product_id}, ${data.variant_id}, '${data.handle}', '${data.price}', '${data.image}', '${data.title}', '${data.quantity}', '${key}')">
                                <div class="copy-multiwishlist-icon"></div>
                            </div>`
                        : ""
                    }
                    <div class="delete-icon-main" onClick="removeItem(${data.product_id}, ${data.variant_id}, ${data.wishlist_id}, '${data.handle}')">
                        <div class="deleteIcon"></div>
                    </div>
                    <div class="modal-product-image"><a href="${wfGetDomain}products/${data.handle
                    }?variant=${data.variant_id}"><img src="${data.image}" alt="${data.title
                    }" height="auto" width="100%" /></a></div>
                    
                    <div class="product-content-sec">
                        <h3 class="title11" style="color: ${modalDrawerTextColor}; text-align: ${generalSetting.wlTextAlign}"><a href="${wfGetDomain}products/${data.handle
                    }?variant=${data.variant_id}">${variantNAME}</a></h3>
                    
                    <p class="product-selected-variants" style="color: ${modalDrawerTextColor}; text-align: ${generalSetting.wlTextAlign}">${variantData}</p>${isPrice
                        ? `<div class="product-option-price">${currentNewPrice}</div>`
                        : ""
                    }
                    
                    ${isQuantity
                        ? `<div class="quantity-div">${customLanguage.quantityText || "Quantity"}
                            ${foundVariant?.available
                            ? `
                                <div class="quantity-minus-plus">
                                    <div class="quant-minus" onClick="updateQuantity(event, ${data.product_id}, ${data.wishlist_id})">-</div>
                                    <span class="quant-update" data-quant="${data.quantity}">${data.quantity}</span>
                                    <div class="quant-plus" onClick="updateQuantity(event, ${data.product_id}, ${data.wishlist_id})">+</div>
                                </div>`
                            : `<div class="quantity-minus-plus drawerDisableClass">
                                    <div class="drawerDisableClass">-</div>
                                    <span class="drawerDisableClass" data-quant="${data.quantity}">${data.quantity}</span>
                                    <div class="drawerDisableClass">+</div>
                                </div>`
                        }
                        </div>`
                        : ""
                    }
                    ${isMoveToCart
                        ? `<div class="movecart-button">
                            ${foundVariant?.available
                            ? hasTag
                                ? `<div id="viewItem${data.variant_id}" class="cartButtonStyle" onClick="viewItem('${data.handle}')">
                                        View Item
                                      </div>`
                                : `<div id="addItemToCart${data.variant_id}" class="cartButtonStyle" onClick="addToCartWf(event, ${data.variant_id}, ${data.wishlist_id}, ${data.product_id}, '${modifiedString}', ${priceToDb}, '${data.image}', '${data.handle}', '${itemIndex}')">
                                        ${customLanguage.addToCart}
                                      </div>`
                            : `<div class="cartButtonStyle" style="cursor: not-allowed; opacity: 0.8">
                                    ${customLanguage.outofStock}
                                  </div>`
                        }
                          </div>`
                        : ""
                    }
                    </div>
                </div>`;
            } else if (response.status === 404 || response === null) {

                wishlistBody += `<div class="wishlist-grid1"><div class="delete-icon-main" onClick="removeItem(${data.product_id}, ${data.variant_id}, ${data.wishlist_id}, '${data.handle}')">
                <div class="deleteIcon"></div>
                </div>
            
                <div class="modal-product-image"><img src="${data.image}" alt="${data.title}" height="auto" width="100%" /></div>
                
                <div class="product-content-sec">
                    <h3 class="title11" style="color: ${modalDrawerTextColor}; text-align: ${generalSetting.wlTextAlign}">${data.title}</h3>
                    
                    <div class="movecart-button">
                        <div class="cartButtonStyle" style="cursor: not-allowed; opacity: 0.8">
                            ${customLanguage.productNotAvailableText || "Product not available"}
                            </div>
                        </div>
                    </div>
                </div>`;
            } else {

                console.log("esle past")


                wishlistBody += `<div class="wishlist-grid1">
                        <span>Something is wrong with this product</span>
                    </div>`
            }
        }
        wishlistBody += `</div>`
    }
    wishlistBody += "</div><div class='wg-no-match-found'></div>";
    document.querySelectorAll(".show-title").forEach((el) => (el.innerHTML = wishlistBody));
    if (currentPlan >= 2) {
        fxnAfterItemsLoadedOfWishlist();
    }
    document.querySelectorAll("div#main-Modal-form h3.title11 a, div#main-Modal-form p.product-selected-variants").forEach((element) => (element.style.color = modalDrawerTextColor));
}

function viewItem(handle) {
    window.top.location = `${wfGetDomain}products/${handle}`
}

function toggleWishlistBox(key) {
    const wishlistBox = document.querySelector(`.wishlist-modal-box[data-key="${key}"]`);
    const drawerBox = document.querySelectorAll(`.drawer-row[data-key="${key}"]`);
    const arrow = document.querySelector(`.wg-arrow-up[onclick="toggleWishlistBox('${key}')"], .wg-arrow-down[onclick="toggleWishlistBox('${key}')"]`);
    if (wishlistBox) {
        wishlistBox.classList.toggle("collapsed");
    }
    // drawerBox.forEach(div => div.classList.toggle("collapsed"));
    drawerBox.forEach(div => {
        if (div.classList.contains("collapsed")) {
            div.classList.remove("collapsed");
            div.style.display = "grid";
            div.offsetHeight;
        } else {
            div.classList.add("collapsed");
            setTimeout(() => {
                if (div.classList.contains("collapsed")) {
                    div.style.display = "none";
                }
            }, 400);
        }
    });
    if (arrow) {
        arrow.classList.toggle("wg-arrow-up");
        arrow.classList.toggle("wg-arrow-down");
    }
}

async function renderDrawerContentFxn() {
    renderLoader();
    shareWishlistFXN();
    const arrayList = isMultiwishlistTrue
        ? allWishlistData
        : getWishlistByKey(allWishlistData, "favourites");
    const { isPrice, isQuantity, isMoveToCart } = await showButtons();
    document.querySelector(".drawer-text").innerHTML = `${customLanguage.modalHeadingText}`;
    renderViewAs();
    drawerButtonDiv();
    if (arrayList.length === 0) {
        await disableShare(arrayList, ".drawerShareTextStyle")
        return (document.querySelector(".drawer-main").innerHTML = `<h4 class="drawer-cart-empty"> ${customLanguage.noMoreItem} </h4> <a class="a-main" href="${generalSetting?.continueShoppingLink || "/collections/all"}"> <div class="cartButtonStyle"> ${customLanguage.continueShopping || storeFrontDefLang.continueShopping} </div> </a>`);
    }
    await disableShare(arrayList, ".drawerShareTextStyle")

    let wishlistBody = `<table class="drawer-table"><tbody>`;
    for (let itemIndex = 0; itemIndex < arrayList.length; itemIndex++) {
        let item = arrayList[itemIndex];
        let key = Object.keys(item)[0];
        let items = item[key];
        wishlistBody += isMultiwishlistTrue ? `<tr class="wf-multi-Wish-heading">
                            <td class="wf-multi-Wish-content">
                                <span class="wg-arrow-up" onclick="toggleWishlistBox('${key}')"></span>
                                <h3 data-key="${key}">${key}</h3>
                                <span class="edit-main-icon" onclick="editWishlistName(event, '${key}')">
                                    <span class="editWish"></span>
                                </span>

                                <div class="editWishDiv">
                                    <div class="editWishDivInner">
                                        <input type="text" class="editInput" placeholder="Enter wishlist name" value="${key}">
                                        <div onclick="saveEditWishlistName(event, '${key}')" class="check-icon-main">
                                            <div class="check-multiwishlist-icon"></div>
                                        </div>
                                        <div onclick="closeEditWishlistName(event, '${key}')" class="close-icon-main">
                                            <div class="close-multiwishlist-icon"></div>
                                        </div>
                                    </div>
                                    <p class="errorPara">Please enter name*</p>
                                </div>
                            </td>
                            <td class="delete-main-icon" onclick="deleteWishlist(event, '${key}')">
                                <span class="deleteWish"></span>
                            </td>
                        </tr>` : "";

        if (items.length === 0) {
            wishlistBody += `<tr class="drawer-row wf-empty-multiwishlist" data-key="${key}">
                                <td><h4 class="drawer-cart-empty">${customLanguage.noMoreItem}</h4>
                                <a class="a-main" href="${generalSetting?.continueShoppingLink || "/collections/all"}">
                                    <div class="cartButtonStyle">${customLanguage?.addProductButtonText || storeFrontDefLang?.addProductButtonText}</div>
                                </a></td>
                            </tr>`;
            continue;
        }
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            let data = items[itemIndex];
            let response;
            let jsonData;
            let foundVariant;
            let hasTag = false;

            if (permanentDomain === 'l-a-girl-cosmetics.myshopify.com') {
                response = await fetch(`${wfGetDomain}pages/${data.variant_id}786.js`);
                // foundVariant = await response.json();
            }
            else if (permanentDomain !== '00b979.myshopify.com') {
                response = await fetch(`${wfGetDomain}variants/${data.variant_id}.js`);
                foundVariant = await response.json();
            }
            else {
                response = await fetch(`${wfGetDomain}products/${data.handle}.js`);
                jsonData = await response.json();
                foundVariant = jsonData.variants.find(v => Number(v.id) === Number(data.variant_id));
                hasTag = jsonData?.tags?.includes("wg_pdp") || false;
            }
            // const response = await fetch(`${wfGetDomain}variants/${data.variant_id}.js`);
            // const response = await fetch(`${wfGetDomain}products/${data.handle}.js`);

            if (response.ok) {
                // const jsonData = await response.json();
                // const foundVariant = jsonData.variants.find(v => Number(v.id) === Number(data.variant_id));
                // const hasTag = jsonData.tags?.includes("wg_pdp") || false;
                // const foundVariant = await response.json();
                const variantArray = [
                    foundVariant?.option1,
                    foundVariant?.option2,
                    foundVariant?.option3,
                ]?.filter((option) => option && option !== "Default Title");

                let actualPrice = foundVariant?.compare_at_price
                    ? changeMoney(foundVariant?.compare_at_price)
                    : null;
                const salePrice = changeMoney(foundVariant?.price);

                let currentNewPrice =
                    foundVariant?.compare_at_price &&
                        foundVariant?.compare_at_price > foundVariant?.price
                        ? `
                            <div class="wf-sale-price">${actualPrice}</div> 
                            <div class="wf-discount-price">${salePrice}</div>
                            <span class="Polaris-Sale-Text--root Polaris-Text--bodySm">
                                ${customLanguage.saleText ||
                        storeFrontDefLang.saleText
                        }
                            </span>`
                        : salePrice;

                const modifiedString = data.title
                    .replace(/'/g, "/wg-sgl")
                    .replace(/"/g, "/wg-dbl");

                const variantNAME = currentPlan >= 4 ? foundVariant?.name : data.title;
                const variantData =
                    variantArray.length > 0 ? variantArray.join(" / ") : "";
                const priceToDb =
                    foundVariant?.compare_at_price &&
                        foundVariant?.compare_at_price > foundVariant?.price
                        ? foundVariant?.price
                        : foundVariant?.compare_at_price || foundVariant?.price;

                wishlistBody += `<tr class='drawer-row' data-key="${key}">
                                <td class="drawer-product-image"><a href="${wfGetDomain}products/${data.handle
                    }?variant=${data.variant_id}"><img src="${data.image
                    }" height="70px" width="100px" alt='${variantNAME}' /></a></td>
                                <td>
                                    <h3><a class="drawer-anchor" style="color: ${modalDrawerTextColor} !important;" href="${wfGetDomain}products/${data.handle
                    }?variant=${data.variant_id}">${variantNAME}</a></h3>
                                    <p class="product-selected-variants">${variantData}</p>
                                    <div class="btn-flex addbtn">

                    ${(data.price === null || data.price === "" || data.price === "null") ? "" :
                        isPrice
                            ? `<div class="product-option-price">${currentNewPrice}</div>`
                            : ""
                    }

                    ${(data.price === null || data.price === "" || data.price === "null") ? "" : isQuantity
                        ? `<div class='quantity-div'>
                                            ${customLanguage.quantityText ||
                        "Quantity"
                        }
                                            ${foundVariant?.available === true
                            ? `
                                            <div class="quantity-minus-plus">
                                                <div class="quant-minus" onClick="updateQuantity(event, ${data.product_id}, ${data.wishlist_id})">-</div>
                                                <span class="quant-update" data-quant="${data.quantity}">${data.quantity}</span>
                                                <div class="quant-plus" onClick="updateQuantity(event, ${data.product_id}, ${data.wishlist_id})">+</div>
                                            </div>`
                            : `<div class="quantity-minus-plus drawerDisableClass">
                                                <div class="drawerDisableClass">-</div>
                                                <span class="drawerDisableClass" data-quant="${data.quantity}">${data.quantity}</span>
                                                <div class="drawerDisableClass">+</div>
                                            </div>`
                        }
                                        </div>`
                        : ""
                    }
                    ${(data.price === null || data.price === "" || data.price === "null") ? "" :
                        isMoveToCart
                            ? `<div class="movecart-button">
                            ${foundVariant?.available
                                ? hasTag
                                    ? `<div id="viewItem${data.variant_id}" class="cartButtonStyle" onClick="viewItem('${data.handle}')">
                                        View Item
                                      </div>`
                                    : `<div id="addItemToCart${data.variant_id}" class="cartButtonStyle" onClick="addToCartWf(event, ${data.variant_id}, ${data.wishlist_id}, ${data.product_id}, '${modifiedString}', ${priceToDb}, '${data.image}', '${data.handle}', '${itemIndex}')">
                                        ${customLanguage.addToCart}
                                      </div>`
                                : `<div class="cartButtonStyle" style="cursor: not-allowed; opacity: 0.8">
                                    ${customLanguage.outofStock}
                                  </div>`
                            }
                          </div>`
                            : ""
                    }

                    ${isMultiwishlistTrue
                        ? `<div class="main-drawer-copy-icon copy-drawer-multi-icon" onClick="copyItem(${data.product_id}, ${data.variant_id}, '${data.handle}', '${data.price}', '${data.image}', '${data.title}', '${data.quantity}', '${key}')"></div>`
                        : ""
                    }

                    <div onClick="removeItem(${data.product_id
                    }, ${data.variant_id}, ${data.wishlist_id
                    },'${data.handle}')" class="deleteIconStyle deleteICON"></div>
                                </td>
                    </tr>`;
            } else if (response.status === 404) {
                wishlistBody += `<tr class='drawer-row'>
                        <td class="drawer-product-image"><a><img src="${data.image
                    }" height="70px" width="100px" alt='${data.title
                    }' /></a></td>
                        <td>
                            <h3>${(permanentDomain === 'l-a-girl-cosmetics.myshopify.com') ?
                        ` ${data?.title?.split("~")[0]} <span>${data?.title?.split("~")[1]}</span>` :
                        `${data?.title}`
                    }



                            </h3>
                            <div><div class="cartButtonStyle" style="cursor: not-allowed; opacity: 0.8">${customLanguage.productNotAvailableText ||
                    "Product not available"
                    }</div></div>
                            <div onClick="removeItem(${data.product_id}, ${data.variant_id
                    }, ${data.wishlist_id},'${data.handle
                    }')" class="deleteIconStyle deleteICON"></div>
                        </td>
                    </tr>`;
            } else {
                wishlistBody += `<div class="wishlist-grid1">
                    <span>Something is wrong with this product</span>
                </div>`
            }
        }
    }

    wishlistBody += "</tbody></table>";
    document.querySelector(".drawer-main").innerHTML = wishlistBody;
    currentPlan >= 2 && fxnAfterItemsLoadedOfWishlist();
}

// ----------la girl quantity----------
// ${(permanentDomain === 'l-a-girl-cosmetics.myshopify.com') ?
//     `<div class="quantity-minus-plus">
//         <div class="quant-minus" onClick="updateQuantity(event, ${data.product_id}, ${data.wishlist_id})">-</div>
//         <span class="quant-update" data-quant="${data.quantity}">${data.quantity}</span>
//         <div class="quant-plus" onClick="updateQuantity(event, ${data.product_id}, ${data.wishlist_id})">+</div>
//     </div>` : ""}




// ${isMoveToCart
//     ? `<div>${foundVariant?.available === true
//         ? `
//                         <div id='addItemToCart${itemIndex}' class="cartButtonStyle" onClick="addToCartWf(event,${data.variant_id}, ${data.wishlist_id}, ${data.product_id}, '${modifiedString}', ${priceToDb}, '${data.image}','${data.handle}')">${customLanguage.addToCart}</div>`
//         : `<div class="cartButtonStyle" style="cursor: not-allowed; opacity: 0.8">${customLanguage.outofStock}</div>`
//     }
//                     </div>
//                 </div>
//                 `
//     : ""
// }


async function drawerButtonDiv() {
    const { isMoveToCart } = await showButtons();
    const totalObjects = await getCount(allWishlistData);
    const shouldRender = isMultiwishlistTrue ? allWishlistData.length > 0 : totalObjects > 0;

    const buttonContent = `
        <div class="btn-flex endbtn">
            ${shouldRender ? `
                <div class="db-div">
                    <div onclick="clearAllWishlist()" class="cartButtonStyle addAllToCartButton">
                        ${customLanguage.clearAllWishlist || storeFrontDefLang.clearAllWishlist}
                    </div>
                </div>
            ` : ""}
            ${isMoveToCart && totalObjects > 0 ? `
                <div class="db-div">
                    <div onclick="addAllToCart()" class="cartButtonStyle addAllToCartButton">
                        ${customLanguage.addAllToCart}
                    </div>
                </div>
            ` : ""}
            <div class="db-div">
                <a style="text-decoration: none;" href="${wfGetDomain}cart">
                    <div class="cartButtonStyle">${customLanguage.viewCart}</div>
                </a>
            </div>
        </div>`;

    document.querySelectorAll(".drawer-button-div").forEach(div => div.innerHTML = buttonContent);
}

async function modalButtonFxn() {
    const { isMoveToCart } = await showButtons();
    const totalObjects = await getCount(allWishlistData);
    const shouldRender = isMultiwishlistTrue ? allWishlistData.length > 0 : totalObjects > 0;

    const buttonContent = `
        <div class="modal-button-div">
            ${shouldRender ? `
                <div class="vcb-width wg-clearwishlist">
                    <div onclick="clearAllWishlist()" class="cartButtonStyle addAllToCartButton">
                        ${customLanguage.clearAllWishlist || storeFrontDefLang.clearAllWishlist}
                    </div>
                </div>
            ` : ""}
            ${isMoveToCart && totalObjects > 0 ? `
                <div class="vcb-width wg-addalltocart">
                    <div onclick="addAllToCart()" class="cartButtonStyle addAllToCartButton">
                        ${customLanguage.addAllToCart}
                    </div>
                </div>
            ` : ""}
            <div class="vcb-width wg-viewcart">
                <a style="text-decoration: none;" href="${wfGetDomain}cart">
                    <div class="cartButtonStyle">${customLanguage.viewCart}</div>
                </a>
            </div>
        </div>`;

    document.querySelectorAll(".modal-button-div").forEach(div => div.innerHTML = buttonContent);
}

/** SHARED WISHLIST FUNCTIONS **/
async function sharedPageFunction() {
    let params = (new URL(document.location)).searchParams;
    let sharedId = params.get("id");
    const sharedName = params.get("name");

    const sharedIdProp = atob(sharedId);
    const dcryptedSharedName = atob(sharedName)

    await Conversion(dcryptedSharedName, sharedIdProp, "reload");
    let allData = await getSharedWishlistData(sharedId)

    const arrayList = isMultiwishlistTrue
        ? allData
        : getWishlistByKey(allData, "favourites");

    await renderMultiSharedModalContent(arrayList, sharedIdProp)
};

async function renderMultiSharedModalContent(arrayList, sharedId) {
    if (currentPlan > 1) {
        let poweredByText = document.querySelectorAll(".powered-by-text");
        for (let i = 0; i < poweredByText.length; i++) {
            poweredByText[i].innerHTML = "";
        }
    }
    renderViewAs();
    const { isPrice, isQuantity, isMoveToCart } = await showButtons();

    document.querySelector(".show-shared-wishlist").innerHTML = `<div class="loader-css" ><span></span></div>`;

    document.querySelector(".wishlist-page-main.page-width").style.color = modalDrawerTextColor;
    document.querySelector(".wishlist-page-main.page-width").style.textAlign = generalSetting.wlTextAlign;

    const headingElement = document.querySelector(".shared-page-heading");
    if (headingElement) {
        headingElement.innerHTML = `${customLanguage.sharedPageHeading}`;
        headingElement.style.textAlign = generalSetting.wlTextAlign;
        headingElement.style.color = modalDrawerTextColor;
    }

    if (!customerEmail) {
        document.querySelector(".shared-page-auth").innerHTML = `${customLanguage?.loginTextForWishlist || storeFrontDefLang.loginTextForWishlist} <a href ="/account">${customLanguage?.loginTextAnchor || storeFrontDefLang?.loginTextAnchor}</a> ${customLanguage?.orText || storeFrontDefLang?.loginTextAnchor} <a href="/account/register"> ${customLanguage?.createAccountAnchor || customLanguage?.createAccountAnchor}</a>`;

        document.querySelector(".shared-page-auth").style.textAlign = generalSetting.wlTextAlign;
        document.querySelector(".shared-page-auth").style.color = modalDrawerTextColor;
    }

    document.querySelectorAll(`.gridText`).forEach((el) => el.innerHTML = `${customLanguage.textForGridIcon}`);

    let gridCount = localStorage.getItem("grid-count") || "3";
    localStorage.setItem("grid-count", gridCount);
    document.querySelectorAll(`.grid${gridCount}`).forEach((el) => el.classList.add("wf-active-grid-focus"));

    // buttonStyleFxn();
    const wishlistData = await getDataFromSql()
    const addNewClass = `wishlist-modal-${gridCount}`;
    let wishlistBody = `<div class="wishlist-modal-all">`;


    for (let itemIndex = 0; itemIndex < arrayList.length; itemIndex++) {
        let item = arrayList[itemIndex];
        let key = Object.keys(item)[0];
        let items = item[key];

        wishlistBody += isMultiwishlistTrue ? `<div class="wf-multi-Wish-heading">
                          <div class="wf-multi-Wish-content">
                            <span class="wg-arrow-up" onclick="toggleWishlistBox('${key}')"></span>
                            <h3 data-key="${key}">${key}</h3> 
                          </div>
                      </div>` : "";

        if (items.length === 0) {
            wishlistBody += `<div class="wishlist-modal-box wf-empty-multiwishlist" data-key="${key}">
                              <h4 class="drawer-cart-empty">${customLanguage.noMoreItem}</h4>
                              <a class="a-main" href="${generalSetting?.continueShoppingLink || "/collections/all"}">
                                  <div class="cartButtonStyle">${customLanguage?.addProductButtonText || storeFrontDefLang?.addProductButtonText}</div>
                              </a>
                          </div>`;
            continue;
        }

        wishlistBody += `<div class="wishlist-modal-box ${addNewClass}" data-key="${key}">`

        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            let data = items[itemIndex];

            let response;
            let jsonData;
            let foundVariant;
            let hasTag = false;


            if (permanentDomain === 'l-a-girl-cosmetics.myshopify.com') {
                response = await fetch(`${wfGetDomain}pages/${data.variant_id}786.js`);
                // foundVariant = await response.json();
            } else if (permanentDomain !== '00b979.myshopify.com') {
                response = await fetch(`${wfGetDomain}variants/${data.variant_id}.js`);
                foundVariant = await response.json();
            } else {
                response = await fetch(`${wfGetDomain}products/${data.handle}.js`);
                jsonData = await response.json();
                foundVariant = jsonData.variants.find(v => Number(v.id) === Number(data.variant_id));
                hasTag = jsonData?.tags?.includes("wg_pdp") || false;
            }

            // const response = await fetch(`${wfGetDomain}variants/${data.variant_id}.js`);
            // const response = await fetch(`${wfGetDomain}products/${data.handle}.js`);
            if (response.ok) {
                // const jsonData = await response.json();
                // const foundVariant = jsonData.variants.find(v => Number(v.id) === Number(data.variant_id));
                // const hasTag = jsonData.tags?.includes("wg_pdp") || false;
                // const foundVariant = await response.json();
                const variantArray = [
                    foundVariant?.option1,
                    foundVariant?.option2,
                    foundVariant?.option3,
                ]?.filter((option) => option && option !== "Default Title");

                let actualPrice = foundVariant?.compare_at_price
                    ? changeMoney(foundVariant?.compare_at_price)
                    : null;
                const salePrice = changeMoney(foundVariant?.price);

                let currentNewPrice = foundVariant?.compare_at_price && foundVariant?.compare_at_price > foundVariant?.price
                    ? ` <div class="wf-sale-price">${actualPrice}</div> 
              <div class="wf-discount-price">${salePrice}</div>
              <span style="${collectionBtnSetting.iconPosition === "icon-top-left" ? "margin-left: 70%" : ""
                    }" class="Polaris-Sale-Text--root Polaris-Text--bodySm">
                  ${customLanguage.saleText || storeFrontDefLang.saleText}
              </span>`
                    : salePrice;

                const modifiedString = data.title
                    ?.replace(/'/g, "/wg-sgl")
                    ?.replace(/"/g, "/wg-dbl");


                const variantNAME = permanentDomain === 'l-a-girl-cosmetics.myshopify.com' ? data.title : currentPlan >= 4 ? foundVariant?.name : data.title;
                const variantData = variantArray.length > 0 ? variantArray.join(" / ") : "";
                const priceToDb = foundVariant?.compare_at_price && foundVariant?.compare_at_price > foundVariant?.price
                    ? foundVariant?.price
                    : foundVariant?.compare_at_price || foundVariant?.price;

                wishlistBody += `
              <div class="wishlist-grid1">
                <div class="modal-product-image">
                  <a href="${wfGetDomain}products/${data.handle}?variant=${data.variant_id}">
                    <img src="${data.image}" alt="${variantNAME}" height="auto" width="100%" />
                  </a>
                </div>
                
                <div class="product-content-sec">
                  <h3 class="title11">
                    <a href="${wfGetDomain}products/${data.handle}?variant=${data.variant_id}">
                      <b></b> ${variantNAME}
                    </a>
                  </h3>
                <p class="product-selected-variants" style="color: ${modalDrawerTextColor}; text-align: ${generalSetting.wlTextAlign}">${variantData}</p>
                
            ${(data.price === null || data.price === "" || data.price === "null") ? "" :
                        isPrice
                            ? `<div class="product-option-price">${currentNewPrice}</div>`
                            : ""
                    }
  
                    ${(data.price === null || data.price === "" || data.price === "null") ? "" : isQuantity
                        ? `<div class='quantity-div'>
                    ${customLanguage.quantityText || "Quantity"}
                    ${foundVariant?.available
                            ? `<div class="quantity-minus-plus">
                      <div class="quant-minus" onClick="updateQuantity(event, ${data.product_id}, ${data.wishlist_id})">-</div>
                      <span class="quant-update" data-quant="${data.quantity}">${data.quantity}</span>
                      <div class="quant-plus" onClick="updateQuantity(event, ${data.product_id}, ${data.wishlist_id})">+</div>
                    </div>`
                            : `<div class="quantity-minus-plus drawerDisableClass">
                      <div class="drawerDisableClass">-</div>
                      <span class="drawerDisableClass" data-quant="${data.quantity}">${data.quantity}</span>
                      <div class="drawerDisableClass">+</div>
                    </div>`
                        }
              </div>`
                        : ""
                    }
  
            ${(data.price === null || data.price === "" || data.price === "null") ? "" :
                        isMoveToCart
                            ? `<div class="movecart-button">
                            ${foundVariant?.available
                                ? hasTag
                                    ? `<div id="viewItem${itemIndex}" class="cartButtonStyle" onClick="viewItem('${data.handle}')">
                                        View Item
                                      </div>`
                                    : `<div id="addItemToCart${itemIndex}" class="cartButtonStyle" onClick="addToCartWf(event, ${data.variant_id}, ${data.wishlist_id}, ${data.product_id}, '${modifiedString}', ${priceToDb}, '${data.image}', '${data.handle}')">
                                        ${customLanguage.addToMyCart}
                                      </div>`
                                : `<div class="cartButtonStyle" style="cursor: not-allowed; opacity: 0.8">
                                    ${customLanguage.outofStock}
                                  </div>`
                            }
                          </div>`
                            : ""
                    }
                            
            ${generalSetting.buttonTypeShareWishlist === "asIcon"
                        ? `<div class="sharedIconDiv" data-sql_data = ${data.product_id} onClick="addToMyWishlist(event, ${data.product_id}, ${data.variant_id}, '${data.handle}', ${priceToDb}, '${data.image}', '${modifiedString}', '${data.quantity}', ${sharedId})"></div>`
                        : `<div class='cartButtonStyle deleteButtonDown' data-sql_data = ${data.product_id} onClick="addToMyWishlist(event, ${data.product_id}, ${data.variant_id}, '${data.handle}', ${priceToDb}, '${data.image}', '${modifiedString}', '${data.quantity}', ${sharedId})">
                <div class='inside-button-div'>${customLanguage.addToMyWishlist}</div>
              </div>`
                    }
            </div>
        </div>`
            } else {
                wishlistBody += `<div class="wishlist-grid1">
            <div class="modal-product-image">
                <a><img src="${data.image}" alt="${data.title
                    }" height="auto" width="100%" /></a>
            </div>
            <div class="product-content-sec">
                <h3 class="title11">
                ${(permanentDomain === 'l-a-girl-cosmetics.myshopify.com') ?
                        ` ${data?.title?.split("~")[0]} <br> <span>${data?.title?.split("~")[1]}</span>` :
                        `${data?.title}`
                    }
                </h3>



                <div class="movecart-button">
                    <div class="cartButtonStyle" style="cursor: not-allowed; opacity: 0.8">${customLanguage.productNotAvailableText ||
                    "Product not available"
                    }</div></div></div>
        </div>`
            }
        }
        wishlistBody += `</div>`
    }

    // -----------la girl quantity---------
    // ${(permanentDomain === 'l-a-girl-cosmetics.myshopify.com') ?
    //     `<div class="quantity-minus-plus drawerDisableClass">
    //   <div class="drawerDisableClass">-</div>
    //   <span class="drawerDisableClass" data-quant="${data.quantity}">${data.quantity}</span>
    //   <div class="drawerDisableClass">+</div>
    // </div>` : ""}


    wishlistBody += "</div>";
    document.querySelector(".show-shared-wishlist").innerHTML = wishlistBody;
    currentPlan >= 2 && fxnAfterItemsLoadedOfWishlist();

    const iconPosition = await checkIconPostion();

    let imgHeight = 10;
    if (iconPosition.checkClassExist === true) {
        const getImage = document.querySelectorAll(".modal-product-image");
        getImage.forEach((element) => {
            let imgElement = element.parentNode.querySelector("img");
            if (imgElement) {
                imgHeight = imgElement.height - Number(iconPosition.iconHeight) - 5;
            }
        });
    }
    const sharedIconDiv = document.querySelectorAll(".sharedIconDiv");

    sharedIconDiv.forEach(async function (div) {
        const sqlData = div.getAttribute('data-sql_data');
        const matchingItem = await checkFound(wishlistData, parseInt(sqlData))
        div.classList.add(iconPosition.iconPosition)

        if (matchingItem) {
            const updateWishlistIconCollection = `<div class="collection_icon_new_selected" style="${iconPosition.checkClassExist === true ? `top: ${imgHeight}px;` : ''}"><div style="filter: ${colIconSelectedColor}; ${collectionIconSize()}" class="${iconPosition.iconStyle}"><span class="span-hearticon"></span></div></div>`

            div.innerHTML = updateWishlistIconCollection;
        } else {
            const updateWishlistIconCollection = `<div class="collection_icon_new" style="${iconPosition.checkClassExist === true ? `top: ${imgHeight}px;` : ''}"><div style="filter: ${colIconDefaultColor}; ${collectionIconSize()}" class="${iconPosition.iconStyle}"><span class="span-hearticon"></span></div></div>`

            div.innerHTML = updateWishlistIconCollection;
        }
    });

    styleFxnForApp(".wishlist-page-main h3.title11", "aligncolor");
    styleFxnForApp(".wishlist-page-main p.product-selected-variants", "aligncolor");
    styleFxnForApp(".wishlist-page-main .product-option-price", "aligncolor");
    styleFxnForApp(".wishlist-page-main.quantity-div", "aligncolor");

}

async function addToMyWishlist(
    event,
    product_id,
    variant_id,
    handle,
    price,
    image,
    title,
    quantity,
    sharedId
) {
    const { accessToken, accessEmail } = await getCurrentLoginFxnForSharedPage();
    const dataToSend = {
        shopName: permanentDomain,
        guestToken: accessToken,
        customerEmail: accessEmail,
        shopDomain: shopDomain,
    };

    // Fetch wishlist data and check if the item is already present
    let wishlistDataInSql = await getDataFromSql(dataToSend);
    const matchFound = await checkFound(wishlistDataInSql, parseInt(product_id));

    const bodyData = {
        shopName: permanentDomain,
        plan: currentPlan,
        guestToken: accessToken,
        customerEmail: accessEmail,
        productId: product_id,
        variantId: variant_id,
        price: price,
        handle: handle,
        title: title,
        image: image,
        quantity: quantity,
        language: wfGetDomain,
        permission: "dont_remove",
        referral_id: sharedId
    };

    if (isMultiwishlistTrue && !matchFound) {
        renderPopupLoader()
        if (wishlistDataInSql.length === 0 || !matchFound) {
            openMultiWishlist(bodyData, product_id, "shared");
        } else {
            alertToast(`${customLanguage.sharedPageAlreadyAdded}`);
        }
    } else {
        if (!matchFound) {
            bodyData.wishlistName = ["favourites"];
            saveSharedWishlist(bodyData);
        } else {
            alertToast(`${customLanguage.sharedPageAlreadyAdded}`);
        }
    }
}

async function saveSharedWishlist(data) {
    try {
        const userData = await fetch(`${serverURL}/create-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                shopName: data.shopName,
                plan: data.plan,
                guestToken: data.guestToken,
                customerEmail: data.customerEmail,
                productId: data.productId,
                variantId: data.variantId,
                price: data.price,
                handle: data.handle,
                title: data.title,
                image: data.image,
                quantity: data.quantity,
                language: data.language,
                storeName: wf_shopName,
                wishlistName: data.wishlistName,
                permission: data.permission,
                referral_id: data.referral_id,
                wfGetDomain: wfGetDomain
            }),
        })


        let result = await userData.json();
        if (result.msg === "item updated" && result.isAdded === "yes") {
            await showCountAll();
            alertToast(`${customLanguage.sharedPageItemAdded}`);
            await renderAddToWishlistIcon(data.productId);
        } else if (result.msg === "already added") {
            alertToast(`${customLanguage.sharedPageAlreadyAdded}`);
        }
        if (result.msg === "limit cross") {
            alertContent(customLanguage?.quotaLimitAlert || "Wishlist Quota of this store reached its monthly limit, We have notified store owner to upgrade their plan. Sorry for the inconvenience");
        }
    } catch (error) {
        console.log("errr ", error)
    }
}


async function renderAddToWishlistIcon(product_id) {
    const sharedIconDivs = document.querySelectorAll('.sharedIconDiv');
    // console.log("sharedIconDivs", sharedIconDivs)
    let updateWishlistIconCollection;
    const iconPosition = await checkIconPostion();
    let imgHeight = 10;
    let indexOfDiv;

    if (iconPosition.checkClassExist === true) {
        const getImage = document.querySelectorAll(".modal-product-image");
        getImage.forEach((element) => {
            let imgElement = element.parentNode.querySelector("img");
            if (imgElement) {
                imgHeight = imgElement.height - Number(iconPosition.iconHeight) - 5;
            }
        });
    }
    const matchFound = await checkFound(allWishlistData, parseInt(product_id))

    if (allWishlistData.length > 0 && matchFound) {
        updateWishlistIconCollection = `<div style-"position:relative; z-index: 10;"><div class="collection_icon_new_selected ${iconPosition.iconPosition
            }" style="${iconPosition.checkClassExist === true ? `top: ${imgHeight}px;` : ""
            }"><div style="filter: ${colIconSelectedColor}; ${collectionIconSize()}" class="${iconPosition.iconStyle
            }"><span class="span-hearticon"></span></div></div></div>`;
    } else {
        updateWishlistIconCollection = `<div style-"position:relative; z-index: 10;"><div class="collection_icon_new ${iconPosition.iconPosition
            }" style="${iconPosition.checkClassExist === true ? `top: ${imgHeight}px;` : ""
            }"><div style="filter: ${colIconDefaultColor}; ${collectionIconSize()}" class="${iconPosition.iconStyle
            }"><span class="span-hearticon"></span></div></div></div>`;
    }
    sharedIconDivs.forEach(function (div, index) {
        const sqlData = div.getAttribute('data-sql_data');
        if (parseInt(sqlData) === parseInt(product_id)) {
            indexOfDiv = index
        }
    });

    sharedIconDivs[indexOfDiv].innerHTML = updateWishlistIconCollection;
}


/**REMOVE ITEM **/
async function removeItem(
    product_id,
    variant_id,
    user_id,
    handle,
    showAlert = true
) {
    let selectedWf = document.querySelectorAll(".wf-wishlist-collection-icon");
    let data = null;
    if (selectedWf.length > 0) {
        for (let i = 0; i < selectedWf.length; i++) {
            let selectedIds = selectedWf[i].getAttribute("data-productid");
            if (Number(selectedIds) === Number(product_id)) {
                data = i;
                break;
            }
        }
    }

    const getCurrentLogin = await getCurrentLoginFxn();

    try {
        const userData = await fetch(`${serverURL}/delete-item`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productId: product_id,
                variantId: variant_id,
                userId: user_id,
                shopName: permanentDomain,
                customerEmail: getCurrentLogin,
                plan: currentPlan,
                storeName: wf_shopName
            }),
        });

        let result = await userData.json();
        if (result.msg === "item updated") {
            isMultiwishlistTrue && renderLoader();
            await showCountAll();

            createFilterOptionInStructure();

            showAlert === true && !isMultiwishlistTrue && alertToast(`${customLanguage.alertForRemoveButton}`);

            const arrayList = isMultiwishlistTrue
                ? allWishlistData
                : await getWishlistByKey(allWishlistData, "favourites");

            const renderFn = generalSetting.wishlistDisplay === "drawer"
                ? () => renderDrawerContentFxn()
                : () => renderMultiModalContentFxn(arrayList);

            await renderFn();
            shareWishlistFXN();
            modalButtonFxn();
            drawerButtonDiv();

            sessionStorage.setItem("wishId", JSON.stringify(arrayList));
            const matchFound = await checkFound(allWishlistData, product_id);

            (currentPlan >= 2) && await checkCollectionCounterData(product_id, !matchFound && "remove");
            (currentPlan >= 2) && await checkCounterData(product_id, !matchFound && "remove");

            const mainWishlistDiv = document.getElementById("wishlist-guru");
            const proId = injectCoderr.getAttribute("data-product-id");

            if (mainWishlistDiv) {
                if (Number(proId) === Number(product_id)) {
                    matchFound ? alreadyInWishlist() : addToWishList();
                }
            }

            collectionIcon(product_id, matchFound);
            customIconAddedRemoveToWishlist(product_id, matchFound);
            buttonAddedRemoveWishlist(product_id, matchFound);
            injectButtonAddedRemoveWishlist(product_id, matchFound);

            // ------for la girls drawer------
            customIconAddedRemoveToWishlistLaGirl(product_id, matchFound)

            currentPlan >= 2 && fxnAfterRemoveFromWishlist();
            (currentPlan >= 3 && generalSetting?.trendingLayout) && await renderTrendingGridData();

        }
    } catch (error) {
        console.log("errr ", error);
    }
}


/**MOVE TO CART BUTTON **/
// async function refreshCart() {
//     try {
//         // Fetch the cart drawer content
//         // document.documentElement.dispatchEvent(new CustomEvent("cart:cart-drawer", { bubbles: true, detail: { sections: cart - drawer } }));
//         document.dispatchEvent(new Event("dispatch:cart-drawer:open", { detail: { opener: true } }))
//         const response = await fetch(window.Shopify.routes.root + "?section=cart-drawer");

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const responseText = await response.text();
//         const wgHtml = new DOMParser().parseFromString(responseText, 'text/html');

//         // Select the elements from the fetched HTML
//         const newCartDrawer = wgHtml.querySelector('.cart-drawer');
//         const newCountBubble = wgHtml.querySelector('.wbhcartitem');
//         const newPrice = wgHtml.querySelector('.wbcarthtotal strong ');
//         const newCartDrawerBroadcast = wgHtml.querySelector('cart-drawer');
//         const newCountBubble2 = wgHtml.querySelector('.header__desktop__button cart-count');
//         const newCountBubbleMobile = wgHtml.querySelector('.header__mobile__button cart-count');

//         if (!newCartDrawer || !newCountBubble) {
//             console.error('Required elements not found in fetched HTML.');
//         }

//         // Update the current cart drawer
//         const cartDrawer = document.querySelector('#CartDrawer');
//         const countBubble = document.querySelector('.wbhcartitem');
//         const coutPrice = document.querySelector('.wbcarthtotal strong ');

//         const CartDrawerBroadcast = document.querySelector('cart-drawer');
//         const countBubble2 = document.querySelector('.header__desktop__button cart-count');
//         const countBubbleMobile = wgHtml.querySelector('.header__mobile__button cart-count');




//         if (cartDrawer) {
//             cartDrawer.innerHTML = newCartDrawer.innerHTML;
//         } else {
//             console.error('#CartDrawer not found in the document.');
//         }

//         if (countBubble) {
//             countBubble.innerHTML = newCountBubble.innerHTML;
//         } else {
//             console.error('.wbhcartitem not found in the document.');
//         }

//         if (countBubble2) {
//             countBubble2.innerHTML = newCountBubble2.innerHTML;
//         } else {
//             console.error('.wbhcartitem not found in the document.');
//         }

//         if (coutPrice) {
//             coutPrice.innerHTML = newPrice.innerHTML;
//         } else {
//             console.error('cart price not found in the document.');
//         }


//         // if (newCartDrawerBroadcast) {
//         //     CartDrawerBroadcast.innerHTML = newCartDrawerBroadcast.innerHTML;
//         // }

//         if (countBubbleMobile) {
//             countBubbleMobile.innerHTML = newCountBubbleMobile.innerHTML;
//         } else {
//             console.error('.wbhcartitem not found in the document.');
//         }


//         // Add or remove classes
//         const body = document.body;
//         const cartDrawerElement = document.querySelector('cart-drawer');
//         const subCartDrawer = document.querySelector('subcart-drawer');

//         if (body) {
//             body.classList.add('overflow-hidden');
//         }

//         if (cartDrawerElement) {
//             cartDrawerElement.classList.add('active');
//             cartDrawerElement.classList.remove('is-empty');
//         } else {
//             console.error('<cart-drawer> not found in the document.');
//         }

//         if (subCartDrawer) {
//             subCartDrawer.classList.add('active');
//         } else {
//             console.error('<subcart-drawer> not found in the document.');
//         }
//     } catch (error) {
//         console.error('Error fetching or updating cart drawer:', error);
//     }
// };


async function refreshCart() {
    try {
        // Fetch the cart drawer content
        document.dispatchEvent(new Event("dispatch:cart-drawer:open", { detail: { opener: true } }))
        const response = await fetch(window.Shopify.routes.root);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseText = await response.text();
        const wgHtml = new DOMParser().parseFromString(responseText, 'text/html');

        // Select the elements from the fetched HTML
        const newCartDrawer = wgHtml.querySelector('.cart-drawer');
        const newCountBubble = wgHtml.querySelector('.wbhcartitem');
        const newPrice = wgHtml.querySelector('.wbcarthtotal strong ');
        const newCartDrawerBroadcast = wgHtml.querySelector('cart-drawer cart-items');
        const newCountBubble2 = wgHtml.querySelector('.header__desktop__button cart-count');
        const newCountBubbleMobile = wgHtml.querySelector('.header__mobile__button cart-count');

        if (!newCartDrawer || !newCountBubble) {
            console.error('Required elements not found in fetched HTML.');
        }

        // Update the current cart drawer
        const cartDrawer = document.querySelector('#CartDrawer');
        const countBubble = document.querySelector('.wbhcartitem');
        const coutPrice = document.querySelector('.wbcarthtotal strong ');

        const CartDrawerBroadcast = document.querySelector('cart-drawer cart-items');
        const countBubble2 = document.querySelector('.header__desktop__button cart-count');
        const countBubbleMobile = document.querySelector('.header__mobile__button cart-count');

        const countDrawerCount = document.querySelector('.cart__title cart-count');
        const newcountDrawerCount = wgHtml.querySelector('.cart__title cart-count');


        if (cartDrawer) {
            cartDrawer.innerHTML = newCartDrawer.innerHTML;
        } else {
            console.log('#CartDrawer not found in the document.');
        }
        if (countDrawerCount) {
            countDrawerCount.replaceWith(newcountDrawerCount); // Replace old cart items
        } else {
            countDrawerCount.appendChild(newcountDrawerCount); // Fallback if no old items exist
        }

        if (countBubble) {
            countBubble.replaceWith(newCountBubble);
        } else {
            // countBubble.appendChild(newCountBubble);
        }
        if (countBubbleMobile) {
            countBubbleMobile.replaceWith(newCountBubbleMobile);
        } else {
            // countBubbleMobile.appendChild(newCountBubble);
        }

        if (countBubble2) {
            countBubble2.replaceWith(newCountBubble2);
        } else {
            // countBubble2.appendChild(newCountBubble2);
        }

        if (coutPrice) {
            coutPrice.innerHTML = newPrice.innerHTML;
        } else {
            console.log('cart price not found in the document.');
        }

        if (CartDrawerBroadcast) {
            CartDrawerBroadcast.replaceWith(newCartDrawerBroadcast); // Replace old cart items
        } else {
            newCartDrawerBroadcast.appendChild(newCartDrawerBroadcast); // Fallback if no old items exist
        }

        if (countBubbleMobile) {
            countBubbleMobile.innerHTML = newCountBubbleMobile.innerHTML;
        } else {
            console.log('.wbhcartitem not found in the document.');
        }


        // Add or remove classes
        const body = document.body;
        const cartDrawerElement = document.querySelector('cart-drawer');
        const subCartDrawer = document.querySelector('subcart-drawer');

        if (body) {
            body.classList.add('overflow-hidden');
        }

        if (cartDrawerElement) {
            cartDrawerElement.classList.add('active');
            cartDrawerElement.classList.remove('is-empty');
        } else {
            console.log('<cart-drawer> not found in the document.');
        }

        if (subCartDrawer) {
            subCartDrawer.classList.add('active');
        } else {
            console.log('<subcart-drawer> not found in the document.');
        }
    } catch (error) {
        console.log('Error fetching or updating cart drawer:', error);
    }
};

async function addToCartWf(
    event,
    variantId,
    userId,
    productId,
    title,
    price,
    image,
    handle,
    index
) {
    let productPrice = (price / 100).toFixed(2);
    const getCartButton = document.getElementById(`addItemToCart${index}`);
    getCartButton && getCartButton.classList.add("quantity_disabled");
    let movecartButton = event.target.parentNode;
    let previousQuantityDiv = movecartButton.previousElementSibling;
    let quantUpdateElement = previousQuantityDiv.querySelector(".quant-update");
    let quantityText = quantUpdateElement.textContent.trim();
    let quantity = quantityText;

    data = {
        id: variantId,
        quantity: quantity,
    };

    const res = await cartFunction(data)
    if (res.message !== "Cart Error" && res.status !== 422) {
        await refreshCart();

        // const cartData = await fetch("/cart.js").then((response) => response.json());
        // const matchingItem = cartData.items.find(
        //     (dev) => Number(dev.variant_id) === Number(variantId)
        // );

        // const newQuantity = matchingItem !== undefined ? matchingItem.quantity : quantity;

        let cartProduct = {
            variantId: variantId,
            userId: userId,
            productId: productId,
            title: title,
            price: productPrice,
            image: image,
            quantity: quantity,
            wfGetDomain: wfGetDomain
        };

        await addToCartRecord([cartProduct]);

        if (generalSetting.wishlistRemoveData === "yes") {
            removeItem(productId, variantId, userId, handle, false);
            (currentPlan >= 3 && generalSetting?.trendingLayout) && await renderTrendingGridData();
            getCartButton && getCartButton.classList.remove("quantity_disabled");
        }
    }
}


async function addToCartRecord(data) {
    try {
        const cartItems = await fetch(`${serverURL}/cart-item-record`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        let result = await cartItems.json();
    } catch (error) {
        console.log("errr ", error);
    }
}

/**ADD ALL TO CART BUTTON **/
async function addAllToCart() {
    isMultiwishlistTrue
        ? await renderAllToCart(allWishlistData)
        : await allToCartFxn(getWishlistByKey(allWishlistData, "favourites")[0].favourites || [], '')
}

async function renderAllToCart(arrayList) {
    const encodedData = JSON.stringify(arrayList);
    closeMultiWishlist();
    getMultiWishlistDiv.style.display = "block";
    let wishlists = "";

    wishlists += `<div class="multiCheckbox"><ul id="dataList">`;
    multiArray.forEach((item, index) => {
        wishlists += `<li>
                    <label for="item-${index}" class="item-${index}">
                        <input type="checkbox" onclick="handleCheckboxClick(event)" id="item-${index}">
                        <p style="margin:0;">${item}</p>
                    </label>
                  </li>`;
    });
    wishlists += `</ul></div>`;

    const clearButton = `<div id="all-to-cart"></div><button class="saveBtn cartButtonStyle" onclick="addAllYesBtn(event)">${customLanguage.addAllToCart || storeFrontDefLang.addAllToCart}</button>`;

    const multiWishlistData = `<div>
            <h3>${customLanguage.addAllToCart || storeFrontDefLang.addAllToCart}</h3>
            ${wishlists}
            ${clearButton}
            <p id=mainErrorPara"></p>
        </div>`;

    document.getElementById("wg-multiWishlistInnerContent").innerHTML = multiWishlistData;
    document.getElementById("all-to-cart").setAttribute("data-addAllToCart", encodedData);
}

async function addAllYesBtn(event) {
    const mainErrorPara = event.target.closest("#wg-multiWishlistInnerContent").querySelector("#mainErrorPara");

    let combinedItems = [];
    let viewItemProducts = [];
    const allData = document.getElementById("all-to-cart").getAttribute('data-addAllToCart')
    const parsedData = JSON.parse(allData);

    if (checkedItems.length > 0) {
        checkedItems.forEach(key => {
            const matchingData = parsedData.find(item => item[key]);
            if (matchingData) {
                matchingData[key].forEach(product => {
                    viewItemProducts.push({ ...product })
                    const existingProduct = combinedItems.find(p => p.product_id === product.product_id);
                    if (existingProduct) {
                        existingProduct.quantity += product.quantity;
                    } else {
                        combinedItems.push({ ...product });
                    }
                });
            }
        });
        getMultiWishlistDiv.style.display = "none";
        checkedItems = []
        await allToCartFxn(combinedItems, viewItemProducts)
    } else {
        mainErrorPara.style.display = "block";
        mainErrorPara.innerHTML = `${storeFrontDefLang.chooseallToCartWish}`;
        return;
    }
}

async function allToCartFxn(allData, viewItemProducts = []) {
    const isBtn = document.querySelector(".addAllToCartButton");
    isBtn && isBtn.classList.add("quantity_disabled");

    if (viewItemProducts.length === 0) {
        viewItemProducts = allData;
    }
    let allToDB = []
    if (allData.length !== 0) {
        let val = [];
        let cartArr = [];

        const product_data = (
            await Promise.all(
                allData.map(async (data) => {
                    try {
                        const response = await fetch(`${wfGetDomain}products/${data.handle}.js`);
                        if (!response.ok) {
                            throw new Error(
                                `Failed to fetch product data for ${data.handle}`
                            );
                        }
                        const jsonData = await response.json();
                        const hasTag = jsonData.tags?.includes("wg_pdp") || false;
                        const foundVariant = jsonData.variants.find(
                            (variant) => variant.id === Number(data.variant_id)
                        );
                        if (foundVariant && foundVariant?.available && !hasTag) {
                            allToDB.push(data)
                            val.push({
                                id: parseInt(data.variant_id),
                                quantity: data.quantity,
                            });
                            return data;
                        } else {
                            return null;
                        }
                    } catch (error) {
                        console.error(error);
                        return null;
                    }
                })
            )
        ).filter((data) => data !== null);

        try {
            for (const data of val) {
                const res = await cartFunction(data, false);
                if (res.message !== "Cart Error" && res.status !== 422) {
                    await refreshCart();
                    const dataToDb = allToDB.find(item => Number(item.variant_id) === Number(data.id));

                    if (dataToDb) {
                        if (generalSetting.wishlistRemoveData === "yes") {
                            await removeItem(
                                dataToDb.product_id,
                                dataToDb.variant_id,
                                dataToDb.wishlist_id,
                                dataToDb.handle,
                                false
                            );
                            (currentPlan >= 3 && generalSetting?.trendingLayout) && await renderTrendingGridData();
                        }

                        // const cartData = await fetch("/cart.js").then((response) => response.json());
                        // const matchingItem = cartData.items.find(
                        //     (dev) => Number(dev.variant_id) === Number(data.id)
                        // );

                        // const newQuantity = matchingItem !== undefined ? matchingItem.quantity : dataToDb.quantity;


                        cartArr.push({
                            variantId: dataToDb.variant_id,
                            userId: dataToDb.wishlist_id,
                            productId: dataToDb.product_id,
                            title: dataToDb.title,
                            price: dataToDb.price,
                            image: dataToDb.image,
                            quantity: dataToDb.quantity,
                            wfGetDomain: wfGetDomain
                        });
                        await addToCartRecord(cartArr);
                    }
                }

                if (isBtn) {
                    isBtn.classList.remove("quantity_disabled");
                }

                // alertToast(
                //     customLanguage.alertAddAllToCart || storeFrontDefLang.alertAddAllToCart
                // );
            }
            alertToast(
                customLanguage.alertAddAllToCart || storeFrontDefLang.alertAddAllToCart
            );
        } catch (error) {
            console.error("Error processing cart items:", error);
        }
    } else {
        alert(`${customLanguage.noMoreItem}...`);
    }
}

// async function cartFunction(data, alertValue = true) {
//     fetch("/cart/add.js", {
//         body: JSON.stringify(data),
//         credentials: "same-origin",
//         headers: {
//             "Content-Type": "application/json",
//             "X-Requested-With": "xmlhttprequest",
//         },
//         method: "POST",
//     })
//         .then((response) => {
//             return response.json();
//         })
//         .then((json) => {
//             if (alertValue === true) {
//                 if (json.message === "Cart Error" || json.status === 422) {
//                     alertContent(json.description);
//                 } else {
//                     alertToast(`${customLanguage.alertForAddToCartButton}`);
//                 }
//             }
//             // window.location = "/cart";
//             fetch("/cart.js")
//                 .then((response) => response.json())
//                 .then((data) => {
//                     let cartBubble = document.querySelector(".cart-count-bubble");
//                     if (cartBubble === null) {
//                         let cartDiv = document.querySelector(".icon-cart-empty");
//                         const div = document.createElement("div");
//                         div.innerHTML = `<div class="cart-count-bubble added-by-wishlist-app"><span aria-hidden="true">${data.item_count}</span>
//                         <span class="visually-hidden">${data.item_count} items</span>
//                      </div>`;

//                         if (cartDiv) {
//                             cartDiv.after(div);
//                         }
//                     } else {
//                         let listCount = `<span aria-hidden="true">${data.item_count}</span><span class="visually-hidden">${data.item_count} item</span>`;
//                         document.querySelector(".cart-count-bubble").innerHTML = listCount;
//                     }
//                 });
//         })
//         .catch((err) => {
//             console.error(err);
//         });
// }

async function cartFunction(data, alertValue = true) {
    try {
        const response = await fetch("/cart/add.js", {
            body: JSON.stringify(data),
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "xmlhttprequest",
            },
            method: "POST",
        });

        const json = await response.json();

        if (alertValue) {
            if (json.message === "Cart Error" || json.status === 422) {
                alertContent(json.description);
            } else {
                alertToast(`${customLanguage.alertForAddToCartButton}`);
            }
        }

        const cartResponse = await fetch("/cart.js");
        const cartData = await cartResponse.json();

        let cartBubble = document.querySelector(".cart-count-bubble");

        if (cartBubble === null) {
            let cartDiv = document.querySelector(".icon-cart-empty");
            const div = document.createElement("div");
            div.innerHTML = `
                <div class="cart-count-bubble added-by-wishlist-app">
                    <span aria-hidden="true">${cartData.item_count}</span>
                    <span class="visually-hidden">${cartData.item_count} items</span>
                </div>`;

            if (cartDiv) {
                cartDiv.after(div);
            }
        } else {
            let listCount = `
                <span aria-hidden="true">${cartData.item_count}</span>
                <span class="visually-hidden">${cartData.item_count} items</span>`;
            cartBubble.innerHTML = listCount;
        }
        return json;
    } catch (err) {
        console.error(err);
        throw err;
    }
}


/**SHORT CODE FOR COLLECTION ICON **/
async function wishlistIcon() {
    const iconPosition = await checkIconPostion();
    if (currentPlan >= 2) {
        const getAllWishlistDiv = document.querySelectorAll(".wf-wishlist");

        const prependPromisesWi = Array.from(getAllWishlistDiv).map(
            async (wishlistDiv) => {
                const selectedId = wishlistDiv.getAttribute("product-id");
                const selectedProductHandle = wishlistDiv.getAttribute("product-handle");
                let addWishlistIcon = document.createElement("div");
                addWishlistIcon.style.zIndex = "10";
                addWishlistIcon.style.position = "relative";

                const { isComboIcon } = checkCollectionIcon();
                const countData = await isCountOrNot(selectedId, isCollectionCount);
                const newCountData = onlyTextButton ? `<div class="wf-product-count">${countData}</div>` : countData;
                const matchFound = await checkFound(allWishlistData, selectedId)

                if (allWishlistData.length > 0 && matchFound) {
                    addWishlistIcon.innerHTML = `<div class="collection_icon_new_selected "><div onClick="customCodeButtonClick(${selectedId},'${selectedProductHandle}')" style="filter: ${colIconSelectedColor}; ${collectionIconSize()}"  class="icon-collection ${isComboIcon ? iconPosition.iconStyle2 : iconPosition.iconStyle
                        }"></div></div>${isCollectionCount ? newCountData : ""}`;
                } else {
                    addWishlistIcon.innerHTML = `<div class="collection_icon_new "><div style="filter: ${colIconDefaultColor}; ${collectionIconSize()}"  onClick="customCodeButtonClick(${selectedId},'${selectedProductHandle}')" class="icon-collection ${iconPosition.iconStyle}"></div></div>${isCollectionCount ? newCountData : ""}`;
                }
                wishlistDiv.innerHTML = addWishlistIcon.innerHTML;
                isCollectionCount && renderCollectionTextColor(matchFound ? "added" : "removed", selectedId, isCollectionCount);
            }
        );

        try {
            await Promise.all(prependPromisesWi);
            const allShow = document.querySelectorAll(".wf-wishlist");
            allShow.forEach((wishlistDiv) => {
                wishlistDiv.style.display = "block";
            });
        } catch (error) {
            console.log("Error occurred:", error);
        }
    }
}

async function customCodeButtonClick(selectedId, getHandle) {
    try {
        const buttonClickResponse = await fetch(`${wfGetDomain}products/${getHandle}.js`);
        const buttonClickproductData = await buttonClickResponse.json();

        // const buttonClickJsonData = await buttonClickResponse.json();
        // const buttonClickproductData = buttonClickJsonData.product;

        let buttonClickData = {
            productId: buttonClickproductData.id,
            variantId: buttonClickproductData.variants[0].id,
            price: Number(buttonClickproductData.variants[0].price) / 100,
            handle: buttonClickproductData.handle,
            title: buttonClickproductData.title,
            image: buttonClickproductData.images[0] ? buttonClickproductData.images[0] : "",
            quantity: 1,
            language: wfGetDomain,
        };

        const res = await showLoginPopup(selectedId);
        if (res) return;

        const matchFound = await checkFound(allWishlistData, selectedId)

        if (isMultiwishlistTrue) {
            renderPopupLoader()
            if (allWishlistData.length > 0 && matchFound) {
                buttonClickData.isDelete = "yes";
                openMultiWishlist(buttonClickData, selectedId, "customIcon")
            } else {
                openMultiWishlist(buttonClickData, selectedId, "customIcon")
            }
        } else {
            buttonClickData.wishlistName = matchFound ? ["wfNotMulti"] : ["favourites"];
            await checkCollectionCounterData(selectedId, !matchFound ? "add" : "remove")
            customIconAddedRemoveToWishlist(selectedId, matchFound ? false : true)
            saveMainData(buttonClickData, selectedId, "customIcon")
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function customIconAddedRemoveToWishlist(selectedId, matchinOrNot) {
    const iconPosition = await checkIconPostion();
    const { isComboIcon } = checkCollectionIcon();
    const countData = await isCountOrNot(selectedId, isCollectionCount);
    const newCountData = onlyTextButton ? `<div class="wf-product-count">${countData}</div>` : countData;

    const checkCollectionElements = document.querySelectorAll(`.wf-wishlist-collection-icon[product-id='${selectedId}'] .wf-product-count`);

    checkCollectionElements.forEach(element => {
        updateCountElement(element, newCountData);
    });

    let getCustomWishlist = document.querySelectorAll(".wf-wishlist");
    if (getCustomWishlist.length !== 0) {
        const iconArray = Array.from(getCustomWishlist);
        iconArray.forEach((icon, index) => {
            const id = icon.getAttribute("product-id");
            if (Number(id) === Number(selectedId)) {
                let productHandle = icon.getAttribute("product-handle");
                let updateWishlistIcon = `<div class="${matchinOrNot ? "collection_icon_new_selected" : "collection_icon_new"}"><div style="${matchinOrNot ? `filter: ${colIconSelectedColor};` : `filter: ${colIconDefaultColor};`} ${collectionIconSize()} " onClick="customCodeButtonClick(${selectedId}, '${productHandle}')" class="icon-collection ${isComboIcon && matchinOrNot ? iconPosition.iconStyle2 : iconPosition.iconStyle}"></div></div> ${isCollectionCount ? newCountData : ""}`;

                getCustomWishlist[index].innerHTML = updateWishlistIcon;

                isCollectionCount && renderCollectionTextColor(matchinOrNot ? "added" : "removed", selectedId, isCollectionCount);
            }
        });
    }
}


/**SHORT CODE BUTTON **/
async function wishlistButtonForCollection() {
    if (currentPlan >= 2) {
        const getAllButtonCollection = document.querySelectorAll(".wf-wishlist-button");
        const prependPromises = [];
        const maxConcurrentRequests = 10; // Limit concurrent requests
        const addToWishlistCache = new Map(); // Cache for addToWishlist API results
        const addedToWishlistCache = new Map(); // Cache for alreadyAddedToWishlist API results
        let activeRequests = 0;

        // Throttling function to manage API requests
        async function throttleApiCall(apiFunction, cache, ...args) {
            const [productId] = args;

            // Return cached result if available
            if (cache.has(productId)) {
                return cache.get(productId);
            }

            // Throttle if active requests hit the limit
            while (activeRequests >= maxConcurrentRequests) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            activeRequests++;

            try {
                const result = await apiFunction(...args);
                cache.set(productId, result); // Cache result by product ID
                return result;
            } finally {
                activeRequests--;
            }
        }

        for (const wishlistButtonDiv of getAllButtonCollection) {
            const selectedId = wishlistButtonDiv.getAttribute("product-id");
            const selectedProductHandle = wishlistButtonDiv.getAttribute("product-handle");
            wishlistButtonDiv.style.width = renderWidth(isCollectionCount);

            let addWishlistButton = document.createElement("div");
            addWishlistButton.style.zIndex = "10";
            addWishlistButton.style.position = "relative";
            wishlistButtonDiv.style.display = "none";

            // Fetch data with throttling and caching
            const addToWishlistData = await throttleApiCall(renderButtonAddToWishlist, addToWishlistCache, selectedId, isCollectionCount);
            const alreadyAddedToWishlistData = await throttleApiCall(renderButtonAddedToWishlist, addedToWishlistCache, selectedId, isCollectionCount);
            const matchFound = await checkFound(allWishlistData, selectedId);

            // Conditionally set inner HTML based on matchFound
            addWishlistButton.innerHTML = matchFound
                ? `<div class="button-collection">${alreadyAddedToWishlistData}</div>`
                : `<div class="button-collection">${addToWishlistData}</div>`;

            wishlistButtonDiv.innerHTML = addWishlistButton.innerHTML;

            renderCustomButtonBorder(matchFound ? "added" : "removed", selectedId, isCollectionCount);

            wishlistButtonDiv.onclick = () => {
                buttonColectionClick(selectedId, selectedProductHandle);
            };

            prependPromises.push(Promise.resolve());
        }

        await Promise.all(prependPromises);
        document.querySelectorAll(".wf-wishlist-button").forEach((wishlistDiv) => {
            wishlistDiv.style.display = "flex";
        });
    }
}



if (permanentDomain === 'outfitbook-fr.myshopify.com') {
    if (wfDomainUrl.indexOf("/products/") !== -1) {
        checkQuantityValue(function (updatedValue) {
            newQuantityOutLook = updatedValue
        });
    }
}

async function buttonColectionClick(selectedId, handle) {
    try {
        const buttonResponseData = await fetch(`${wfGetDomain}products/${handle}.js`);
        const buttonJsonData = await buttonResponseData.json();
        let buttonData = {
            productId: buttonJsonData.id,
            variantId: buttonJsonData.variants[0].id,
            price: Number(buttonJsonData.variants[0].price) / 100,
            handle: buttonJsonData.handle,
            title: buttonJsonData.title,
            image: buttonJsonData.images[0] ? buttonJsonData.images[0] : "",
            quantity: newQuantityOutLook || 1,
            language: wfGetDomain,
        };

        const res = await showLoginPopup(selectedId);
        if (res) return;

        const matchFound = await checkFound(allWishlistData, selectedId)

        if (isMultiwishlistTrue) {
            renderPopupLoader()
            if (allWishlistData.length > 0 && matchFound) {
                buttonData.isDelete = "yes";
                openMultiWishlist(buttonData, selectedId, "customButton")
            } else {
                openMultiWishlist(buttonData, selectedId, "customButton")
            }
        } else {
            buttonData.wishlistName = matchFound ? ["wfNotMulti"] : ["favourites"];
            await checkCollectionCounterData(selectedId, !matchFound ? "add" : "remove")
            buttonAddedRemoveWishlist(selectedId, matchFound ? false : true)
            saveMainData(buttonData, selectedId, "customButton")
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function buttonAddedRemoveWishlist(selectedId, matchingOrNot) {
    let getWishlistCustomButton = document.querySelectorAll(".wf-wishlist-button");

    if (getWishlistCustomButton.length !== 0) {
        const iconArray = Array.from(getWishlistCustomButton);
        iconArray.forEach(async (icon, index) => {
            const id = icon.getAttribute("product-id");
            const addToWishlistData = await renderButtonAddToWishlist(id, isCollectionCount);
            const alreadyAddedToWishlistData = await renderButtonAddedToWishlist(id, isCollectionCount);

            // const countData = await isCountOrNot(selectedId, isCollectionCount);

            if (Number(id) === Number(selectedId)) {
                let updateWishlistButton = document.createElement("div");
                updateWishlistButton.style.zIndex = "10";
                updateWishlistButton.style.position = "relative";
                // updateWishlistButton.innerHTML = matchingOrNot
                //     ? `<div class="button-collection">${alreadyAddedToWishlistData}</div>${!onlyTextButton ? countData : ""
                //     }`
                //     : `<div class="button-collection">${addToWishlistData}</div>${!onlyTextButton ? countData : ""
                //     }`;


                updateWishlistButton.innerHTML = matchingOrNot
                    ? `<div class="button-collection">${alreadyAddedToWishlistData}</div>`
                    : `<div class="button-collection">${addToWishlistData}</div>`;

                getWishlistCustomButton[index].innerHTML = updateWishlistButton.innerHTML;
                renderCustomButtonBorder(matchingOrNot ? "added" : "removed", selectedId, isCollectionCount);
            }
        });
    }
}

/**AUTO INJECT COLLECTION ICON AND BUTTON **/
async function collectionIconClick(event, selectedId, handle) {
    if (typeof settingCurrentFilter !== "undefined" && settingCurrentFilter === "boost") {
        event.preventDefault();
        let el = event.target;
        var parentElement = el.closest(".boost-sd__product-item");
        if (parentElement) {
            event.stopPropagation();
        }
    }

    const matchedElement = findMatchingItemSelected(encodeURIComponent(handle));
    let matchedProductId;
    if (matchedElement) {
        matchedProductId = matchedElement.getAttribute('data-variant-id')
        // console.log('Found matching item-selected element:', matchedElement.getAttribute('data-variant-id'));
    }
    event.stopPropagation();
    try {
        const collectionIconResponse = await fetch(`${wfGetDomain}products/${handle}.js`);
        const collectionIconJsonData = await collectionIconResponse.json();
        const variantData = collectionIconJsonData.variants;
        let variant_img, productPrice;

        if (matchedElement !== null) {
            variantData.map((data) => {
                if (data.id === parseInt(matchedProductId)) {
                    productPrice = Number(data.price) / 100;
                    if (data.featured_image === null) {
                        variant_img = collectionIconJsonData.images[0];
                    } else {
                        variant_img = data?.featured_image.src;
                    }
                } else if (matchedProductId == null) {
                    productPrice = Number(data.price) / 100;
                    if (variantData[0]) {
                        if (data.featured_image === null) {
                            variant_img = collectionIconJsonData.images[0];
                        } else {
                            variant_img = data?.featured_image.src;
                        }
                    }
                }


            });
        }

        // const productPrice1 = await getProPrice(handle, matchedElement !== null ? matchedProductId : collectionIconJsonData.variants[0].id);

        let collectionIconData = {
            productId: collectionIconJsonData.id,
            variantId: matchedElement !== null ? matchedProductId : collectionIconJsonData.variants[0].id,
            price: matchedElement !== null ? Number(productPrice) : Number(collectionIconJsonData.variants[0].price) / 100,
            handle: collectionIconJsonData.handle,
            title: collectionIconJsonData.title,
            image: matchedElement !== null ? variant_img : collectionIconJsonData.images[0] ? collectionIconJsonData.images[0] : "",
            quantity: 1,
            language: wfGetDomain
        }

        const res = await showLoginPopup(selectedId);
        if (res) return;

        const matchFound = await checkFound(allWishlistData, selectedId);

        if (isMultiwishlistTrue) {
            renderPopupLoader()
            if (allWishlistData.length > 0 && matchFound) {
                collectionIconData.isDelete = "yes";
                openMultiWishlist(collectionIconData, selectedId, "collection");
            } else {
                openMultiWishlist(collectionIconData, selectedId, "collection");
            }
        } else {
            collectionIconData.wishlistName = matchFound ? ["wfNotMulti"] : ["favourites"];
            await checkCollectionCounterData(selectedId, !matchFound ? "add" : "remove")
            collectionIcon(selectedId, matchFound ? false : true)
            saveMainData(collectionIconData, selectedId, "collection");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// async function collectionIcon(selectedId, matchingOrNot) {
//     if (collectionBtnSetting.collectionType === "buttonType") {
//         const addToWishlistData = await renderButtonAddToWishlist(selectedId, isCollectionCount);
//         const alreadyAddedToWishlistData = await renderButtonAddedToWishlist(selectedId, isCollectionCount);

//         const collectionIcon = document.querySelectorAll('.wf-wishlist-collection-btn');
//         let productIndex, productHandle;
//         const iconArray = Array.from(collectionIcon);

//         iconArray.forEach((icon, index) => {
//             const id = icon.getAttribute("product-id");
//             if (Number(id) === Number(selectedId)) {
//                 productIndex = index;
//                 productHandle = icon.getAttribute("product-handle");
//             }
//         });
//         // const countData = await isCountOrNot(selectedId, isCollectionCount);
//         let addWishlistButton = document.createElement("div");
//         addWishlistButton.style.zIndex = "10";
//         addWishlistButton.style.position = "relative";
//         // addWishlistButton.innerHTML = matchingOrNot
//         //     ? `<div class="button-collection" >${alreadyAddedToWishlistData}</div>${!onlyTextButton ? countData : ""
//         //     }`
//         //     : `<div class="button-collection" >${addToWishlistData}</div>${!onlyTextButton ? countData : ""
//         //     }`;

//         addWishlistButton.innerHTML = matchingOrNot
//             ? `<div class="button-collection" >${alreadyAddedToWishlistData}</div>`
//             : `<div class="button-collection" >${addToWishlistData}</div>`;

//         if (productIndex !== undefined) {
//             collectionIcon[productIndex].innerHTML = addWishlistButton.innerHTML;

//             if (isCollectionCount) {
//                 renderCustomButtonBorder(matchingOrNot ? "added" : "removed", selectedId, isCollectionCount)
//             }

//         }
//     } else {
//         const collectionIcon = document.querySelectorAll('.wf-wishlist-collection-icon');
//         let productIndex = [], productHandle;
//         const iconArray = Array.from(collectionIcon);

//         iconArray.forEach((icon, index) => {
//             const id = icon.getAttribute("product-id");
//             if (Number(id) === Number(selectedId)) {
//                 productIndex.push(index);
//                 productHandle = icon.getAttribute("product-handle");
//             }
//         });

//         if (collectionIcon.length !== 0) {
//             const { isComboIcon, isComboHeart, isComboStar, isComboSave } = checkCollectionIcon();
//             const toggleIconClass = (element, blankClass, solidClass) => {

//                 if (matchingOrNot) {
//                     element.classList.remove(blankClass);
//                     element.classList.add(solidClass);
//                 } else {
//                     element.classList.remove(solidClass);
//                     element.classList.add(blankClass);
//                 }
//             };

//             productIndex.forEach((id) => {
//                 const element = collectionIcon[id]?.querySelector(".wg-collectionIcon");
//                 const checkElement = collectionIcon[id].children[0];

//                 if (checkElement) {
//                     if (matchingOrNot) {
//                         checkElement.classList.add("collection_icon_new_selected");
//                         checkElement.classList.remove("collection_icon_new");
//                     } else {
//                         checkElement.classList.add("collection_icon_new");
//                         checkElement.classList.remove("collection_icon_new_selected");
//                     }
//                 }

//                 if (element) {
//                     if (matchingOrNot) {
//                         element.classList.add("selected");
//                     } else {
//                         element.classList.remove("selected");
//                     }
//                     collectionIconSize();
//                     if (isComboIcon) {
//                         const iconCombos = [
//                             {
//                                 condition: isComboHeart,
//                                 blank: "wg-heart-icon-blank",
//                                 solid: "wg-heart-icon-solid",
//                             },
//                             {
//                                 condition: isComboStar,
//                                 blank: "wg-star-icon-blank",
//                                 solid: "wg-star-icon-solid",
//                             },
//                             {
//                                 condition: isComboSave,
//                                 blank: "wg-save-icon-blank",
//                                 solid: "wg-save-icon-solid",
//                             },
//                         ];

//                         iconCombos.forEach(({ condition, blank, solid }) => {
//                             if (condition) {
//                                 toggleIconClass(element, blank, solid);
//                             }
//                         });
//                     }
//                 }
//             });

//             if (isCollectionCount) {
//                 const countData = await isCountOrNot(selectedId, isCollectionCount);
//                 const newCountData = onlyTextButton ? `<div class="wf-product-count">${countData}</div>` : countData;
//                 const checkCollectionElements = document.querySelectorAll(`.wf-wishlist-collection-icon[product-id='${selectedId}'] .wf-product-count`);

//                 checkCollectionElements.forEach(element => {
//                     updateCountElement(element, newCountData);
//                 });

//                 renderCollectionTextColor(matchingOrNot ? "added" : "removed", selectedId, isCollectionCount);
//             }
//         }
//     }
// }


async function collectionIcon(selectedId, matchingOrNot) {
    if (collectionBtnSetting.collectionType === "buttonType") {
        const addToWishlistData = await renderButtonAddToWishlist(selectedId, isCollectionCount);
        const alreadyAddedToWishlistData = await renderButtonAddedToWishlist(selectedId, isCollectionCount);

        const collectionIcon = document.querySelectorAll('.wf-wishlist-collection-btn');
        const iconArray = Array.from(collectionIcon);
        let addWishlistButton = document.createElement("div");
        addWishlistButton.style.zIndex = "10";
        addWishlistButton.style.position = "relative";



        iconArray.forEach((icon, index) => {
            const id = icon.getAttribute("product-id");
            if (Number(id) === Number(selectedId)) {

                addWishlistButton.innerHTML = matchingOrNot
                    ? `<div class="button-collection" >${alreadyAddedToWishlistData}</div>`
                    : `<div class="button-collection" >${addToWishlistData}</div>`;

                collectionIcon[index].innerHTML = addWishlistButton.innerHTML;

                if (isCollectionCount) {
                    renderCustomButtonBorder(matchingOrNot ? "added" : "removed", selectedId, isCollectionCount)
                }

            }
        });



    } else {
        const collectionIcon = document.querySelectorAll('.wf-wishlist-collection-icon');
        let productIndex = [], productHandle;
        const iconArray = Array.from(collectionIcon);

        iconArray.forEach((icon, index) => {
            const id = icon.getAttribute("product-id");
            if (Number(id) === Number(selectedId)) {
                productIndex.push(index);
                productHandle = icon.getAttribute("product-handle");
            }
        });

        if (collectionIcon.length !== 0) {
            const { isComboIcon, isComboHeart, isComboStar, isComboSave } = checkCollectionIcon();
            const toggleIconClass = (element, blankClass, solidClass) => {

                if (matchingOrNot) {
                    element.classList.remove(blankClass);
                    element.classList.add(solidClass);
                } else {
                    element.classList.remove(solidClass);
                    element.classList.add(blankClass);
                }
            };

            productIndex.forEach((id) => {
                const element = collectionIcon[id]?.querySelector(".wg-collectionIcon");
                const checkElement = collectionIcon[id].children[0];

                if (checkElement) {
                    if (matchingOrNot) {
                        checkElement.classList.add("collection_icon_new_selected");
                        checkElement.classList.remove("collection_icon_new");
                    } else {
                        checkElement.classList.add("collection_icon_new");
                        checkElement.classList.remove("collection_icon_new_selected");
                    }
                }

                if (element) {
                    if (matchingOrNot) {
                        element.classList.add("selected");
                    } else {
                        element.classList.remove("selected");
                    }
                    collectionIconSize();
                    if (isComboIcon) {
                        const iconCombos = [
                            {
                                condition: isComboHeart,
                                blank: "wg-heart-icon-blank",
                                solid: "wg-heart-icon-solid",
                            },
                            {
                                condition: isComboStar,
                                blank: "wg-star-icon-blank",
                                solid: "wg-star-icon-solid",
                            },
                            {
                                condition: isComboSave,
                                blank: "wg-save-icon-blank",
                                solid: "wg-save-icon-solid",
                            },
                        ];

                        iconCombos.forEach(({ condition, blank, solid }) => {
                            if (condition) {
                                toggleIconClass(element, blank, solid);
                            }
                        });
                    }
                }
            });

            if (isCollectionCount) {
                const countData = await isCountOrNot(selectedId, isCollectionCount);
                const newCountData = onlyTextButton ? `<div class="wf-product-count">${countData}</div>` : countData;
                const checkCollectionElements = document.querySelectorAll(`.wf-wishlist-collection-icon[product-id='${selectedId}'] .wf-product-count`);

                checkCollectionElements.forEach(element => {
                    updateCountElement(element, newCountData);
                });

                renderCollectionTextColor(matchingOrNot ? "added" : "removed", selectedId, isCollectionCount);
            }
        }
    }
}


function buttonStyleFxn() {
    const {
        bgColor,
        activeBtn,
        hover,
        textColor,
        fontWeight,
        fontSize,
        fontFamily,
        paddingTopBottom,
        paddingLeftRight,
        marginTopBottom,
        marginLeftRight,
        border,
        borderRadius,
        iconPosition,
        textAlign,
        type,
        cartButtonStyle,
        iconSizeValue,
        iconColor,
        width,
    } = customButton;

    const helloBgColor = onlyTextButton ? "transparent" : bgColor;
    const helloBgColorAlready = onlyTextButton ? "transparent" : activeBtn.bgColor;
    const hoverBgColor = onlyTextButton ? "transparent" : hover.bgColor;
    const isValidIcon = isIconTypeValid(collectionBtnSetting.collectionIconType);

    // Set Ella CSS
    const ellaCss = (getThemeName.themeName === "Ella" || getThemeName.themeName === "Vendy Shopping")
        ? `.header-navigation .header-item:nth-child(3) { align-items: center; }`
        : '';

    // Adjust heart icon for specific shop domain
    if (shopDomain === 'preahkomaitland.com.au') {
        generalSetting.heartIconHeight = 0;
        const adjustIconMargin = (selector) => {
            const icons = document.querySelectorAll(selector);
            if (icons.length > 0) icons[0].style.margin = 0;
        };
        adjustIconMargin(".wg-impulse-headerIcon-desktop .header-heart-position");
        adjustIconMargin(".wg-impulse-headerIcon-mobile .header-heart-position");
    }

    let buttonStyleHead = document.getElementById("console-style");

    if (!buttonStyleHead) {
        buttonStyleHead = document.createElement("style");
        // buttonStyleHead.id = "console-style";
        document.getElementsByTagName("head")[0].appendChild(buttonStyleHead);
    }




    // const buttonStyleHead = document.createElement("style");
    buttonStyleHead.innerHTML = `
        .buttonStyleHead {
            display: flex;
            align-items: center;
            justify-content: ${textAlign};
            gap: 10px;
            flex-direction: ${iconPosition === "right" ? "row-reverse" : "row"};
            background-color: ${helloBgColor} !important;
            color: ${textColor} !important;
            max-width: 100% !important;
            font-weight: ${getFontWt(fontWeight, fontWeight).textFw};
            border: ${!isCountValid && !onlyTextButton
            ? `${border.value}${border.unit} ${border.type} ${border.color} !important;`
            : "none"
        };
            border-radius: ${borderRadius.value}${borderRadius.unit} !important;
            font-size: ${fontSize.value}${fontSize.unit} !important;
            font-family: ${fontFamily} !important;
            padding: ${paddingTopBottom.value}${paddingTopBottom.unit} ${paddingLeftRight.value
        }${paddingLeftRight.unit} !important;
            margin: ${marginTopBottom.value}${marginTopBottom.unit} ${marginLeftRight.value
        }${marginLeftRight.unit} !important;
            cursor: pointer;
            ${!isCountValid &&
        `width: ${width?.value || "100"}${width?.unit || "%"};`
        }
        }
        ${type === "icon"
            ? `
            .wf-wishlist-button {
                width: 40px;
                margin: ${textAlign === "center"
                ? "0 auto"
                : textAlign === "left"
                    ? "0"
                    : "0 0 0 auto"
            } !important;
            }
        `
            : ""
        }
        #main-Modal-form {
            text-align: center;
        }
        .button-collection,
        .modalButtonCollection {
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }
        ${type !== "icon"
            ? `
            .button-collection,
            .wf-wishlist-button .button-collection,
            .modalButtonCollection {
                width: 100%;
            }
        `
            : ""
        }
        .iconColour {
            filter: ${iconColor?.filterColor || iconColor};
            width: ${iconSizeValue}px !important;
            height: ${iconSizeValue}px !important;
            background-size: ${iconSizeValue}px !important;
            display: block !important;
        }
        
        .alreadyIconColour {
            filter: ${activeBtn?.iconColor?.filterColor || activeBtn?.iconColor};
            width: ${iconSizeValue}px !important;
            height: ${iconSizeValue}px !important;
            background-size: ${iconSizeValue}px !important;
            display: block !important;
        }

        .alreadyButtonStyleHead {
            display: flex;
            align-items: center;
            justify-content: ${textAlign};
            gap: 10px;
            flex-direction: ${iconPosition === "right" ? "row-reverse" : "row"};
            background-color: ${helloBgColorAlready} !important;
            color: ${activeBtn.textColor} !important;
            font-weight: ${getFontWt(fontWeight, fontWeight).textFw};
            border: ${!isCountValid && !onlyTextButton
            ? `${activeBtn.border.value}${activeBtn.border.unit} ${activeBtn.border.type} ${activeBtn.border.color} !important;`
            : "none"
        };
            border-radius: ${borderRadius.value}${borderRadius.unit} !important;
            font-size: ${fontSize.value}${fontSize.unit} !important;
            max-width: 100% !important;
            font-family: ${fontFamily} !important;
            padding: ${paddingTopBottom.value}${paddingTopBottom.unit} ${paddingLeftRight.value
        }${paddingLeftRight.unit} !important;
            margin: ${marginTopBottom.value}${marginTopBottom.unit} ${marginLeftRight.value
        }${marginLeftRight.unit} !important;
            text-align: ${textAlign} !important;
            cursor: pointer;
            white-space: nowrap;
            ${!isCountValid &&
        `width: ${width?.value || "100"}${width?.unit || "%"};`
        }
        }
        .wf-product-count {
            font-size: ${fontSize.value}${fontSize.unit} !important;
            font-family: ${fontFamily} !important;
            border-radius: 0 ${borderRadius.value}${borderRadius.unit} ${borderRadius.value
        }${borderRadius.unit} 0 !important;
        }
        .iconDiv {
            width: 40px;
            height: 40px;
            background-color: ${helloBgColor} !important;
            padding: ${paddingTopBottom.value}${paddingTopBottom.unit
        } 0 !important;
            margin: ${marginTopBottom.value}${marginTopBottom.unit
        } 0 !important;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: ${!isCountValid
            ? `${border.value}${border.unit} ${border.type} ${border.color}`
            : "none"
        } !important;
            border-radius: ${borderRadius.value}${borderRadius.unit} !important;
        }
        .iconDivAlready {
            width: 40px;
            height: 40px;
            background-color: ${helloBgColorAlready} !important;
            padding: ${paddingTopBottom.value}${paddingTopBottom.unit
        } 0 !important;
            margin: ${marginTopBottom.value}${marginTopBottom.unit
        } 0 !important;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: ${!isCountValid
            ? `${activeBtn.border.value}${activeBtn.border.unit} ${activeBtn.border.type} ${activeBtn.border.color}`
            : "none"
        } !important;
            border-radius: ${borderRadius.value}${borderRadius.unit} !important;
        }
        .inside-button-div-icon {
            flex: 0 0 ${iconSizeValue}px;
            background-size: ${iconSizeValue}px;
        }
        .wishlist-modal-all .inside-button-div-icon {
            height: ${fontSize.value}${fontSize.unit};
            width: ${fontSize.value}${fontSize.unit};
        }
        .cartButtonStyle {
            background-color: ${cartButtonStyle.bgColor};
            color: ${cartButtonStyle.textColor};
            max-width: 100%;
            border: ${cartButtonStyle.border.value}${cartButtonStyle.border.unit
        } ${cartButtonStyle.border.type} ${cartButtonStyle.border.color};
            border-radius: ${cartButtonStyle.borderRadius.value}${cartButtonStyle.borderRadius.unit
        };
            font-size: ${cartButtonStyle.fontSize.value}${cartButtonStyle.fontSize.unit
        } !important;
            padding: ${cartButtonStyle.paddingTopBottom.value}${cartButtonStyle.paddingTopBottom.unit
        } ${cartButtonStyle.paddingLeftRight.value}${cartButtonStyle.paddingLeftRight.unit
        };
            margin: ${cartButtonStyle.marginTopBottom.value}${cartButtonStyle.marginTopBottom.unit
        } ${cartButtonStyle.marginLeftRight.value}${cartButtonStyle.marginLeftRight.unit
        };
            text-align: ${cartButtonStyle.textAlign};
            cursor: pointer;
            box-sizing: border-box;
            font-weight: ${getFontWt(cartButtonStyle.fontWeight, cartButtonStyle.fontWeight).textFw};
            font-family: ${cartButtonStyle.fontFamily};
        }
        .shareButtonTextStyle {
            color: ${generalSetting.shareWishBtntextColor};
            font-size: ${generalSetting.shareWishBtnfontSize}${generalSetting.shareWishBtnfontSizeUnit
        } !important;
            font-family: ${generalSetting.shareWishBtnfontFamily};
        }
        .img_test {
            filter: ${generalSetting.shareBtnIconColor};
        }
        .collection_icon_new {
            background-color: ${!isValidIcon ? collectionBtnSetting.iconDefaultBgColor : "inherit"
        } !important;
        }
        .collection_icon_new_selected {
            background-color: ${!isValidIcon
            ? collectionBtnSetting.iconSelectedBgColor
            : "inherit"
        } !important;
        }
        .heart-icon-empty {
            background-size: ${iconSizeValue}px !important;
            cursor: pointer;
        }
        .wf-wishlist-collection-btn .inside-button-div-icon{
            flex:0 0 auto;
        }
        .wf-wishlist-collection-icon-modal .modalButtonCollection {
            margin-bottom: 13px;
        }
        .header-heart-position .heartICON,
            .header-heart-position .starICON,
            .header-heart-position .savetICON{
            background-size: ${generalSetting.heartIconWidth}px;
        }
        .header-heart-position {
            margin: 0 ${generalSetting.heartIconHeight}px;
        }
        .menu-drawer__menu-item.list-menu__item .show-count {
            position: absolute;
            top: 0px;
            right: -10px;
        }
        .menu-drawer__menu-item.list-menu__item .heartICON,
        .menu-drawer__menu-item.list-menu__item .starICON,
        .menu-drawer__menu-item.list-menu__item .savetICON {
            margin: auto;
            filter: ${generalSetting.heartIconFilter};
            height: ${generalSetting.heartIconWidth}px;
            width: ${generalSetting.heartIconWidth}px;
        }
        ${isCountValid
            ? `
            #inject_wish_button .buttonStyleHead,
            #wishlist-guru .buttonStyleHead,
            .wf-wishlist-button .buttonStyleHead {
                border: none;
                border-radius: ${borderRadius.value}${borderRadius.unit} 0 0 ${borderRadius.value
            }${borderRadius.unit} !important;
                margin: 0 !important;
                width: 100%;
            }
            #inject_wish_button .alreadyButtonStyleHead,
            #wishlist-guru .alreadyButtonStyleHead,
            .wf-wishlist-button .alreadyButtonStyleHead {
                border: none;
                border-radius: ${borderRadius.value}${borderRadius.unit} 0 0 ${borderRadius.value
            }${borderRadius.unit} !important;
                margin: 0 !important;
                width: 100%;
            }
            #inject_wish_button .iconDiv,
            #wishlist-guru .iconDiv,
            .wf-wishlist-button .iconDiv {
                border: none;
                border-radius: ${borderRadius.value}${borderRadius.unit} 0 0 ${borderRadius.value
            }${borderRadius.unit} !important;
                margin: 0 !important;
            }
            #inject_wish_button .iconDivAlready,
            #wishlist-guru .iconDivAlready,
            .wf-wishlist-button .iconDivAlready {
                border: none;
                border-radius: ${borderRadius.value}${borderRadius.unit} 0 0 ${borderRadius.value
            }${borderRadius.unit} !important;
                background-color: ${helloBgColorAlready} !important;
                margin: 0 !important;
            }
            #wishlist-guru,
            #inject_wish_button,
            .wf-wishlist-button {
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                width: ${width?.value || "100"}${width?.unit || "%"};
                border-radius: ${borderRadius.value}${borderRadius.unit
            } !important;
                font-size: ${fontSize.value}${fontSize.unit} !important;
                font-family: ${fontFamily} !important;
                margin-top: 5px;
                margin: ${type !== "icon"
                ? `${marginTopBottom.value}${marginTopBottom.unit} ${marginLeftRight.value}${marginLeftRight.unit} !important;`
                : `${marginTopBottom.value}${marginTopBottom.unit} 0 !important;`
            }
            }
        `
            : ""
        }

        ${isCollectionCount
            ? `
            .wf-wishlist-button .buttonStyleHead,
            .wf-wishlist-collection-btn .buttonStyleHead {
                border: none;
                border-radius: ${borderRadius.value}${borderRadius.unit} 0 0 ${borderRadius.value
            }${borderRadius.unit} !important;
                margin: 0 !important;
                width: 100%;
            }

            .wf-wishlist-button .alreadyButtonStyleHead,
            .wf-wishlist-collection-btn .alreadyButtonStyleHead {
                border: none;
                border-radius: ${borderRadius.value}${borderRadius.unit} 0 0 ${borderRadius.value
            }${borderRadius.unit} !important;
                margin: 0 !important;
                width: 100%;
            }

            .wf-wishlist-button .iconDiv,
            .wf-wishlist-collection-btn .iconDiv {
                border: none;
                border-radius: ${borderRadius.value}${borderRadius.unit} 0 0 ${borderRadius.value
            }${borderRadius.unit} !important;
                margin: 0 !important;
            }

            .wf-wishlist-button .iconDivAlready,
            .wf-wishlist-collection-btn .iconDivAlready {
                border: none;
                border-radius: ${borderRadius.value}${borderRadius.unit} 0 0 ${borderRadius.value
            }${borderRadius.unit} !important;
                background-color: ${helloBgColorAlready} !important;
                padding: ${paddingTopBottom.value}${paddingTopBottom.unit
            } 0 !important;
                margin: 0 !important;
            }

            .wf-wishlist-button,
            .wf-wishlist-collection-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                width: ${width?.value || "100"}${width?.unit || "%"};
                border-radius: ${borderRadius.value}${borderRadius.unit
            } !important;
                font-size: ${fontSize.value}${fontSize.unit} !important;
                font-family: ${fontFamily} !important;
                margin: ${marginTopBottom.value}${marginTopBottom.unit} ${marginLeftRight.value
            }${marginLeftRight.unit} !important;
                margin-top: 5px;
            }
        `
            : ""
        }
    
        .wg-islogin-buttons {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .wg-islogin-buttons .wg-register-btn {
            background-color: ${generalSetting?.userLogin?.bgColor}; 
            color: ${generalSetting?.userLogin?.textColor}; 
            max-width: 100%;
            border: ${generalSetting?.userLogin?.border.value}${generalSetting?.userLogin?.border.unit
        } ${generalSetting?.userLogin?.border.type} ${generalSetting?.userLogin?.border.color
        };
            border-radius: ${generalSetting?.userLogin?.borderRadius.value}${generalSetting?.userLogin?.borderRadius.unit
        }; 
            font-size: ${generalSetting?.userLogin?.fontSize.value}${generalSetting?.userLogin?.fontSize.unit
        } !important; 
            font-family: ${generalSetting?.userLogin?.fontFamily
        }, ${getFontFamily}, ${getFontFamilyFallback};
            padding: ${generalSetting?.userLogin?.paddingTopBottom.value}${generalSetting?.userLogin?.paddingTopBottom.unit
        } ${generalSetting?.userLogin?.paddingLeftRight.value}${generalSetting?.userLogin?.paddingLeftRight.unit
        } ${generalSetting?.userLogin?.paddingTopBottom.value}${generalSetting?.userLogin?.paddingTopBottom.unit
        } ${generalSetting?.userLogin?.paddingLeftRight.value}${generalSetting?.userLogin?.paddingLeftRight.unit
        }; 
            margin:${generalSetting?.userLogin?.marginTopBottom.value}${generalSetting?.userLogin?.marginTopBottom.unit
        } ${generalSetting?.userLogin?.marginLeftRight.value}${generalSetting?.userLogin?.marginLeftRight.unit
        } ${generalSetting?.userLogin?.marginTopBottom.value}${generalSetting?.userLogin?.marginTopBottom.unit
        } ${generalSetting?.userLogin?.marginLeftRight.value}${generalSetting?.userLogin?.marginLeftRight.unit
        };
            text-align: ${generalSetting?.userLogin?.textAlign};
            cursor: pointer;
            box-sizing: border-box;
            text-transform: uppercase;
        }

        .wg-islogin-buttons .wg-login-btn{
            background-color: ${generalSetting?.guestLogin?.bgColor}; 
            color: ${generalSetting?.guestLogin?.textColor}; 
            max-width: 100%;
            border: ${generalSetting?.guestLogin?.border.value}${generalSetting?.guestLogin?.border.unit
        } ${generalSetting?.guestLogin?.border.type} ${generalSetting?.guestLogin?.border.color
        };
            border-radius: ${generalSetting?.guestLogin?.borderRadius.value}${generalSetting?.guestLogin?.borderRadius.unit
        }; 
            font-size: ${generalSetting?.guestLogin?.fontSize.value}${generalSetting?.guestLogin?.fontSize.unit
        } !important; 
            font-family: ${generalSetting?.guestLogin?.fontFamily
        }, ${getFontFamily}, ${getFontFamilyFallback};
            padding: ${generalSetting?.guestLogin?.paddingTopBottom.value}${generalSetting?.guestLogin?.paddingTopBottom.unit
        } ${generalSetting?.guestLogin?.paddingLeftRight.value}${generalSetting?.guestLogin?.paddingLeftRight.unit
        } ${generalSetting?.guestLogin?.paddingTopBottom.value}${generalSetting?.guestLogin?.paddingTopBottom.unit
        } ${generalSetting?.guestLogin?.paddingLeftRight.value}${generalSetting?.guestLogin?.paddingLeftRight.unit
        }; 
            margin:${generalSetting?.guestLogin?.marginTopBottom.value}${generalSetting?.guestLogin?.marginTopBottom.unit
        } ${generalSetting?.guestLogin?.marginLeftRight.value}${generalSetting?.guestLogin?.marginLeftRight.unit
        } ${generalSetting?.guestLogin?.marginTopBottom.value}${generalSetting?.guestLogin?.marginTopBottom.unit
        } ${generalSetting?.guestLogin?.marginLeftRight.value}${generalSetting?.guestLogin?.marginLeftRight.unit
        };
            text-align: ${generalSetting?.guestLogin?.textAlign};
            cursor: pointer;
            box-sizing: border-box;
            text-transform: uppercase;
        }
        .show-count {
            background-color: ${generalSetting?.headerHeartIconCountBgcolor};
            color: ${generalSetting?.headerHeartIconCountTextcolor};
        }
        .fi-count .show-count {
            background-color: ${generalSetting?.floatingHeartIconCountBgcolor};
            color: ${generalSetting?.floatingHeartIconCountTextcolor};
        }

        .errorPara, #mainErrorPara {
            color: red !important;
        }
    
        .wg-closeMultiwishlist,
        .closebtn,
        .close1,
        .wg-close,
        .closeByShareModal{
            filter: ${generalSetting.wlCrossFilter}
        }

        .drawer-cart-empty,
        #mySidenav.sidenav h2.drawer-text,
        .wishlist-page-main h2.modal-heading,
        .deleteMultiWishlist h3,
        #wg-multiWishlistInnerContent h3,
        #wg-multiWishlistInnerContent h4,
        #mySidenav.sidenav .drawer-table,
        #wg-myModal h2 {
            color: ${modalDrawerTextColor};
        }
        #dataList input[type="checkbox"]:checked {
            background-color: ${modalDrawerTextColor};
            border-color: ${modalDrawerTextColor};
        }
         #dataList input[type="checkbox"] {
            border-color: ${modalDrawerTextColor};
        }
        #myshareModal .modal-share-content .other-sharing-options {
            border-top: 1px solid ${modalDrawerTextColor};
        }
        .wishlist-modal-all .wf-multi-Wish-heading,
        #mySidenav.sidenav .drawer-table .wf-multi-Wish-heading,
        .editWishDivInner .editInput {
            border-bottom: 1px solid ${modalDrawerTextColor};
        }
        #myshareModal .modal-share-content,
        #wg-myModal1 .wg-modal-content1,
        .wishlist-page-main,
        .successDiv,
        #wg-myModal .wg-modal-content,
        
        #wg-multiWishlist_div{
            background-color: ${generalSetting.wlBgColor};
            color: ${modalDrawerTextColor};
        }
        ${generalSetting?.wlTextColor?.filterColor
            ? `
            .wg-icon-parent .share-icons,
            .share-url-div .copyICON,
            .img_test,
            .grid-option .grid1,
            .grid-option .grid2,
            .grid-option .grid3,
            .grid-option .grid4,
            .editWish,
            .wg-arrow-down,
            .wg-arrow-up,
            .deleteWish,
            .check-multiwishlist-icon,
            .close-multiwishlist-icon,
            .deleteICON,
            .copy-drawer-multi-icon {
                filter: ${generalSetting?.wlTextColor?.filterColor};
            }`
            : ""
        }

        .wishlist-page-main h2.modal-heading, 
        .wishlist-page-main h2.shared-page-heading,
        .wishlist-page-main .show-title h3.title11 a, 
        .show-shared-wishlist .product-content-sec h3.title11 a, 
        .wishlist-page-main .show-title h3, 
        .show-shared-wishlist .product-content-sec h3,
        #mySidenav.sidenav h2.drawer-text, 
        #wg-myModal .wg-modal-content h2.modal-heading, 
        #myshareModal .modal-share-content h3,
        #wg-myModal1 .wg-modal-content1 .sharable-link-heading,
        #mySidenav.sidenav .drawer-table td h3 a, 
        #wg-myModal .wg-modal-content .show-title h3.title11 a, 
        #mySidenav.sidenav .drawer-table td h3, 
        #wg-myModal .wg-modal-content .show-title h3,
        .deleteMultiWishlist h3,
        #wg-multiWishlistInnerContent h3,
        .wishlist-modal-all h3 {
            font-weight : ${getFontWt(generalSetting?.wlHeadingFontWt, generalSetting?.wlTextFontWt).headingFw};
            ${generalSetting?.wlHeadingFontFamily &&
        `font-family : ${generalSetting?.wlHeadingFontFamily}`
        };
        }
        
        .wishlist-page-main .modal-page-auth, 
        .wishlist-page-main .shared-page-auth,
        .wishlist-page-main .show-title .product-selected-variants, 
        .show-shared-wishlist .product-content-sec .product-selected-variants,
        .wishlist-page-main .show-title .quantity-div, 
        .show-shared-wishlist .product-content-sec .quantity-div,
        .wishlist-page-main .grid-outer-main .searchData h4, 
        .wishlist-page-main .grid-outer-main .searchbar_Input, 
        .wishlist-page-main .grid-outer-main .grid-option h5, 
        .wishlist-page-main .grid-option h5,
        .drawer-cart-empty,
        .successDiv,
        .iconText,
        
        #wg-myModal .wg-modal-content .modal-page-auth, 
        #mySidenav.sidenav .drawer-table td .product-selected-variants, 
        #wg-myModal .wg-modal-content .show-title .product-selected-variants, 
        #mySidenav.sidenav .drawer-table td .quantity-div, 
        #wg-myModal .wg-modal-content .show-title .quantity-div, 
        #wg-myModal .wg-modal-content .grid-outer-main .searchData h4, 
        #wg-myModal .wg-modal-content .grid-outer-main .searchbar_Input, 
        #wg-myModal .wg-modal-content .grid-outer-main .grid-option h5, 
        #myshareModal .modal-share-content .other-sharing-options h4,
        #myshareModal .modal-share-content label,
        #mySidenav.sidenav .drawer-login-text,
        #wg-isLogin-modal h3,
        
        .deleteMultiWishlist h3,
        .wg-multiWishlistInnerContent h3{
            font-weight : ${getFontWt(generalSetting?.wlHeadingFontWt, generalSetting?.wlTextFontWt).textFw};
            ${generalSetting?.wlTextFontFamily &&
        `font-family : ${generalSetting?.wlTextFontFamily}`
        };
        }

        #wg-multiWishlistInnerContent .saveBtn,
        #multiWishlistInnerContent #createWishlist,
        #multiWishlistInnerContent #copyBtn{
            padding: 5px 10px !important;
            margin: 3px 2px !important;
        }

        .multiCheckbox label {
            align-items: center;
        }

        .wg-disabled {
            pointer-events: none;
            opacity: 0.5;
            cursor: not-allowed;
        }

        .wg-vantage-custom-css .wg-vantage-headerIcon-desktop {
            display: inline-block !important;
        }
        .wg-vantage-custom-css #wg-myModal .wg-modal-content .show-title .modal-product-image, 
        .wg-vantage-custom-css .show-shared-wishlist .modal-product-image, 
        .wg-vantage-custom-css .wishlist-page-main .show-title .modal-product-image {
            aspect-ratio: 2 / 2;
        }

        @media screen and (min-width: 767px) {
            .buttonStyleHead:hover,
            .alreadyButtonStyleHead:hover {
                background-color: ${hoverBgColor} !important;
                color: ${customButton.hover.textColor} !important;
                ${!isCountValid && !onlyTextButton
            ? `
                    border: ${customButton.hover.border.value}${customButton.hover.border.unit} ${customButton.hover.border.type} ${customButton.hover.border.color} !important;
                `
            : ""
        }
            }

            .iconDiv:hover .iconColour,
            .iconDivAlready:hover .alreadyIconColour,
            .buttonStyleHead:hover .iconColour,
            .alreadyButtonStyleHead:hover .alreadyIconColour {
                filter: ${customButton?.hover?.iconColor?.filterColor ||
        customButton.hover.iconColor
        } !important;
            }

            .iconDiv:hover,
            .iconDivAlready:hover {
                background-color: ${customButton.hover.bgColor} !important;
                ${!isCountValid
            ? `
                    border: ${customButton.hover.border.value}${customButton.hover.border.unit} ${customButton.hover.border.type} ${customButton.hover.border.color} !important;
                `
            : ""
        }
            }

            .cartButtonStyle:hover {
                background-color: ${customButton.cartButtonStyle.hover.bgColor};
                color: ${customButton.cartButtonStyle.hover.textColor};
                border: ${customButton.cartButtonStyle.hover.border.value}${customButton.cartButtonStyle.hover.border.unit
        } ${customButton.cartButtonStyle.hover.border.type} ${customButton.cartButtonStyle.hover.border.color
        };
            }

            .shareButtonTextStyle:hover {
                color: ${generalSetting.shareWishBtnhoverTextColor};
            }

            .drawerShareTextStyle:hover,
            .shareButtonStyle:hover {
                filter: ${generalSetting.shareBtnIconHoverColor};
                color: ${generalSetting.shareWishBtnhoverTextColor};
            }

            .wg-islogin-buttons .wg-register-btn:hover {
                background-color: ${generalSetting?.userLogin?.hover.bgColor};
                color: ${generalSetting?.userLogin?.hover.textColor};
                border: ${generalSetting?.userLogin?.hover.border.value}${generalSetting?.userLogin?.hover.border.unit
        } ${generalSetting?.userLogin?.hover.border.type} ${generalSetting?.userLogin?.hover.border.color
        };
            }

            .wg-islogin-buttons .wg-login-btn:hover {
                background-color: ${generalSetting?.guestLogin?.hover.bgColor};
                color: ${generalSetting?.guestLogin?.hover.textColor};
                border: ${generalSetting?.guestLogin?.hover.border.value}${generalSetting?.guestLogin?.hover.border.unit
        } ${generalSetting?.guestLogin?.hover.border.type} ${generalSetting?.guestLogin?.hover.border.color
        };
            }

            .red-heart:hover,
            .collection_icon_new_selected:hover,
            .collection_icon_new:hover,
            #mySidenav.sidenav .drawer-table tr .main-deleteIconStyle:hover,
            #mySidenav.sidenav .drawer-table tr .main-drawer-copy-icon:hover, 
            .delete-icon-main:hover,
            .copy-icon-main:hover,
            .check-icon-main:hover,
            .close-icon-main:hover{
                transform: scale(1.1);
            }

            ${isCountValid
            ? `
                #wishlist-guru:hover .buttonStyleHead,
                #inject_wish_button:hover .buttonStyleHead,
                .wf-wishlist-button:hover .buttonStyleHead,
                #wishlist-guru:hover .alreadyButtonStyleHead,
                #inject_wish_button:hover .alreadyButtonStyleHead,
                .wf-wishlist-button:hover .alreadyButtonStyleHead {
                    border: none;
                    ${!onlyTextButton
                ? `
                        border-right: ${customButton.hover.border.value}${customButton.hover.border.unit} ${customButton.hover.border.type} ${customButton.hover.border.color} !important;
                    `
                : ""
            }
                    background-color: ${hoverBgColor} !important;
                    color: ${customButton.hover.textColor} !important;
                }

                #wishlist-guru:hover,
                #inject_wish_button:hover,
                .wf-wishlist-button:hover {
                    ${!onlyTextButton
                ? `
                        border: ${customButton.hover.border.value}${customButton.hover.border.unit} ${customButton.hover.border.type} ${customButton.hover.border.color} !important;
                    `
                : ""
            }
                    background-color: ${onlyTextButton
                ? hoverBgColor
                : customButton.hover.textColor
            } !important;
                    color: ${onlyTextButton
                ? customButton.hover.textColor
                : customButton.hover.bgColor
            } !important;
                }

                #wishlist-guru:hover .wf-product-count,
                #inject_wish_button:hover .wf-product-count,
                .wf-wishlist-button:hover .wf-product-count {
                    color: ${onlyTextButton
                ? customButton.hover.textColor
                : customButton.hover.bgColor
            } !important;
                }

                .wf-wishlist-button:hover .iconDiv,
                #wishlist-guru:hover .iconDiv,
                #inject_wish_button:hover .iconDiv,
                .wf-wishlist-button:hover .iconDivAlready,
                #wishlist-guru:hover .iconDivAlready,
                #inject_wish_button:hover .iconDivAlready {
                    background-color: ${customButton.hover.bgColor} !important;
                    border: ${customButton.hover.border.value}${customButton.hover.border.unit
            } ${customButton.hover.border.type} ${customButton.hover.border.color
            } !important;
                }

                .wf-wishlist-button:hover .iconColour,
                #wishlist-guru:hover .iconColour,
                #inject_wish_button:hover .iconColour,
                .wf-wishlist-button:hover .alreadyIconColour,
                #wishlist-guru:hover .alreadyIconColour,
                #inject_wish_button:hover .alreadyIconColour {
                    filter: ${customButton?.hover?.iconColor?.filterColor ||
            customButton.hover.iconColor
            };
                }
            `
            : ""
        }

            ${isCollectionCount
            ? `
                .wf-wishlist-button:hover .buttonStyleHead,
                .wf-wishlist-collection-btn:hover .buttonStyleHead,
                .wf-wishlist-button:hover .alreadyButtonStyleHead,
                .wf-wishlist-collection-btn:hover .alreadyButtonStyleHead {
                    border: none;
                    ${!onlyTextButton
                ? `
                        border-right: ${customButton.hover.border.value}${customButton.hover.border.unit} ${customButton.hover.border.type} ${customButton.hover.border.color} !important;
                    `
                : ""
            }
                    background-color: ${hoverBgColor} !important;
                    color: ${customButton.hover.textColor} !important;
                }

                .wf-wishlist-button:hover,
                .wf-wishlist-collection-btn:hover {
                    ${!onlyTextButton
                ? `
                        border: ${customButton.hover.border.value}${customButton.hover.border.unit} ${customButton.hover.border.type} ${customButton.hover.border.color} !important;
                    `
                : ""
            }
                    background-color: ${onlyTextButton
                ? hoverBgColor
                : customButton.hover.textColor
            } !important;
                    color: ${onlyTextButton
                ? customButton.hover.textColor
                : customButton.hover.bgColor
            } !important;
                }

                .wf-wishlist-button:hover .wf-product-count,
                .wf-wishlist-collection-btn:hover .wf-product-count {
                    color: ${onlyTextButton
                ? customButton.hover.textColor
                : customButton.hover.bgColor
            } !important;
                }

                .wf-wishlist-button:hover .iconDiv,
                .wf-wishlist-collection-btn:hover .iconDiv,
                .wf-wishlist-button:hover .iconDivAlready,
                .wf-wishlist-collection-btn:hover .iconDivAlready {
                    background-color: ${customButton.hover.bgColor} !important;
                    border: ${customButton.hover.border.value}${customButton.hover.border.unit
            } ${customButton.hover.border.type} ${customButton.hover.border.color
            } !important;
                }

                .wf-wishlist-button:hover .iconColour,
                .wf-wishlist-collection-btn:hover .iconColour,
                .wf-wishlist-button:hover .alreadyIconColour,
                 .wf-wishlist-collection-btn:hover .alreadyIconColour {
                    filter: ${customButton?.hover?.iconColor?.filterColor ||
            customButton.hover.iconColor
            };
                }
            `
            : ""
        }
        }

        ${getThemeName?.themeName === "Multi" ? `
            .collection_icon_new, 
            .collection_icon_new_selected {
                 z-index: 30 !important;
            }` : ``}

        @media screen and (max-width: 420px) {
            header nav.header__secondary-nav,
            #section-header .Header__Wrapper .Header__SecondaryNav .header nav.header__secondary-nav .wg-prestige-headerIcon-mobile .header-heart-position {
                margin: 0;
            }
        }


            @media screen and (max-width:749px) {
            .wg-vantage-custom-css .header__shopping-cart-links-container {
                display: flex;
                align-items: center;
                justify-content: flex-end;    
            }
            .wg-vantage-custom-css .wg-vantage-headerIcon-mobile .header-heart-position {
                margin: 0;
            }
            }

        ${ellaCss}
    `;

    document.getElementsByTagName("head")[0].appendChild(buttonStyleHead);
}

// async function SqlFunction(product) {
//     let returnMsg;
//     // let accessToken;
//     // if (localStorage.getItem("access-token") === null) {
//     //     const newDATE = new Date();
//     //     const formattedDateTime = newDATE.toISOString().replace(/[-:T.]/g, '').slice(0, 14);

//     //     accessToken = btoa((Math.random() + 1).toString(36).substring(2) + formattedDateTime);
//     //     localStorage.setItem("access-token", accessToken);
//     // } else {
//     //     accessToken = localStorage.getItem("access-token");
//     // }
//     // let accessEmail;
//     // if (localStorage.getItem("customer-email") === null) {
//     //     accessEmail = customerEmail;
//     //     localStorage.setItem("customer-email", customerEmail);
//     // }
//     // else {
//     //     if (localStorage.getItem("customer-email") === customerEmail) {
//     //         accessEmail = localStorage.getItem("customer-email");
//     //     }
//     //     else {
//     //         if (localStorage.getItem("customer-email") !== "" && customerEmail === "") {
//     //             accessEmail = localStorage.getItem("customer-email");
//     //         }
//     //         else {
//     //             if (localStorage.getItem("customer-email") !== "" && localStorage.getItem("customer-email") !== customerEmail) {
//     //                 accessEmail = customerEmail;
//     //                 localStorage.setItem("customer-email", customerEmail);
//     //             }
//     //             else {
//     //                 accessEmail = customerEmail;
//     //                 localStorage.setItem("customer-email", customerEmail);
//     //             }
//     //         }
//     //     }
//     // }

//     let { accessToken, accessEmail } = getAccessToken();

//     try {
//         const userData = await fetch(`${serverURL}/create-user`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 shopName: permanentDomain,
//                 // shopEmail: shopEmail,
//                 plan: currentPlan,
//                 guestToken: accessToken,
//                 customerEmail: accessEmail,
//                 productId: product.productId,
//                 variantId: product.variantId,
//                 price: product.price,
//                 handle: product.handle,
//                 title: product.title,
//                 image: product.image,
//                 quantity: product.quantity,
//                 storeName: wf_shopName,
//                 language: product.language,
//                 wishlistName: product.wishlistName,
//                 DelWishlistName: product.DelWishlistName,
//             }),
//         });
//         let result = await userData.json();
//         returnMsg = result;
//     } catch (error) {
//         console.log("errr ", error);
//         console.log("Something went wrong.. Please try again later");
//     }
//     return returnMsg;
// }


async function SqlFunction(product) {
    let returnMsg;
    let { accessToken, accessEmail } = getAccessToken();

    try {
        const userData = await fetch(`${serverURL}/create-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                shopName: permanentDomain,
                // shopEmail: shopEmail,
                plan: currentPlan,
                guestToken: accessToken,
                customerEmail: accessEmail,
                productId: product.productId,
                variantId: product.variantId,
                price: product.price,
                handle: product.handle,
                title: product.title,
                image: product.image,
                quantity: product.quantity,
                storeName: wf_shopName,
                language: product.language,
                wishlistName: product.wishlistName,
                DelWishlistName: product.DelWishlistName,
                wfGetDomain: wfGetDomain
            }),
        });
        let result = await userData.json();
        returnMsg = result;
    } catch (error) {
        console.log("errr ", error);
        console.log("Something went wrong.. Please try again later");
    }
    return returnMsg;
}




// ------this is for colection icon with activate app code related to heart-icon.js-----
function findMatchingItemSelected(dataVariantUrl) {
    const extractVariantId = (url) => {
        const startIndex = url.indexOf("/products/") + "/products/".length;
        const endIndex = url.indexOf("/", startIndex);
        const end = endIndex === -1 ? url.indexOf("?", startIndex) : endIndex;
        return url.substring(startIndex, end);
    };
    const swatches = document.querySelectorAll(".swatches li");
    let selectedSwatch = null;
    for (const swatch of swatches) {
        const variantUrl = swatch.getAttribute("data-variant-url");
        if (variantUrl) {
            const variantId = extractVariantId(variantUrl);
            if (variantId === dataVariantUrl) {
                if (swatch.classList.contains("item-selected")) {
                    return swatch;
                } else {
                    selectedSwatch = selectedSwatch || swatch;
                }
            }
        }
    }
    return selectedSwatch || null;
}

document.addEventListener('mouseover', (event) => {
    if (event.target.nodeType === 1) {
        const { isComboIcon } = checkCollectionIcon()
        const nearestWishlistDiv = event.target.closest('.wg-collectionIcon, .icon-collection ');
        const toggleHoverIcon = (element, blankClass, solidClass, defaultColor) => {
            requestAnimationFrame(() => {
                element.style.filter = defaultColor;
                element.classList.remove(blankClass);
                element.classList.add(solidClass);
            });
            element.addEventListener('mouseleave', () => {
                requestAnimationFrame(() => {
                    if (!element.classList.contains('selected')) {
                        element.style.filter = defaultColor;
                        element.classList.remove(solidClass);
                        element.classList.add(blankClass);
                    }
                });
            }, { once: true });
        };
        if (nearestWishlistDiv && isComboIcon) {
            const icons = [
                { blank: 'wg-heart-icon-blank', solid: 'wg-heart-icon-solid' },
                { blank: 'wg-star-icon-blank', solid: 'wg-star-icon-solid' },
                { blank: 'wg-save-icon-blank', solid: 'wg-save-icon-solid' }
            ];
            icons.forEach(icon => {
                if (nearestWishlistDiv.classList.contains(icon.blank)) {
                    toggleHoverIcon(
                        nearestWishlistDiv,
                        icon.blank,
                        icon.solid,
                        colIconDefaultColor
                    );
                }
            });
        }
    }
}, true);

function checkCollectionIcon() {
    const isComboIcon = (collectionBtnSetting.collectionIconType === 'comboHeart' || collectionBtnSetting.collectionIconType === 'comboStar' || collectionBtnSetting.collectionIconType === 'comboSave')
    const isComboHeart = collectionBtnSetting.collectionIconType === 'comboHeart';
    const isComboStar = collectionBtnSetting.collectionIconType === 'comboStar';
    const isComboSave = collectionBtnSetting.collectionIconType === 'comboSave';

    return { isComboIcon, isComboHeart, isComboStar, isComboSave }
}

// -------------------------------this code relateed to collection modal icon------------------------
async function collectionBtnAddedRemoveWishlist(selectedId, productHandle, addedText) {
    if (currentCollectionSeting.quickViewShowAs === "icon") {
        const collectionIcon = document.querySelectorAll('.wf-wishlist-collection-icon-modal')
        const position = currentCollectionSeting.quickViewShowOptionAddToCartPosition;
        let themeSelectors = detechThemeName()
        document.querySelectorAll(`.wf-wishlist-collection-icon-modal ${themeSelectors.modalbuttonAppendOnTitle} `);
        const iconPosition = await whichClassIsModalAdded();
        let imgHeight = 10;
        let themeName = "Dawn"
        if (iconPosition.checkClassExist === true) {
            let getProductEle1 = document.querySelectorAll('.wf-wishlist-collection-icon-modal.wf-img')
            imgHeight = getProductEle1[0].previousSibling.clientHeight - Number(iconPosition.iconHeight) - 5
        }
        let updateWishlistIconCollection = "";
        let updateWishlistIconCollectionTitle = "";
        let updateWishlistIconCollectionCart = "";

        updateWishlistIconCollection += `<div class="${addedText === 'added' ? "collection_icon_new_selected" : "collection_icon_new"} ${iconPosition.iconPosition}" style="${iconPosition.checkClassExist === true ? `top :${imgHeight}px;` : ''}"><div style="${addedText === 'added' ? `filter: ${colIconSelectedColor};` : `filter: ${colIconDefaultColor};`} ${collectionIconSize()}" onClick="collectionIconClickModal(event,${selectedId}, '${productHandle}')" class="${iconPosition.iconStyle}"><span class="span-hearticon"></span></div></div>`;
        updateWishlistIconCollectionTitle += `<div class="${addedText === 'added' ? "collection_icon_new_selected" : "collection_icon_new"}  ${currentCollectionSeting.quickViewShowOptionTitle === true ? "modal-icon" : ""} "><div style="${addedText === 'added' ? `filter: ${colIconSelectedColor};` : `filter: ${colIconDefaultColor};`} ${collectionIconSize()}" onClick="collectionIconClickModal(event,${selectedId}, '${productHandle}')" class="${iconPosition.iconStyle}"><span class="span-hearticon"></span></div></div>`;
        updateWishlistIconCollectionCart += `<div class="${addedText === 'added' ? "collection_icon_new_selected" : "collection_icon_new"} ${position === 'left-icon-position' ? "icon-cart-left" : position === 'right-icon-position' ? "icon-cart-right" : position === "center-icon-position" && "icon-cart-center"}"><div style="${addedText === 'added' ? `filter: ${colIconSelectedColor};` : `filter: ${colIconDefaultColor};`} ${collectionIconSize()}" onClick="collectionIconClickModal(event,${selectedId}, '${productHandle}')" class="${iconPosition.iconStyle}"><span class="span-hearticon"></span></div></div>`

        if (collectionBtnSetting.isQuickViewShowOptionTitle) {
            const iconAppendOnTitle = document.querySelectorAll(`.wf-wishlist-collection-icon-modal.wf-title`);
            iconAppendOnTitle[0].innerHTML = updateWishlistIconCollectionTitle;
        }
        if (collectionBtnSetting.isQuickViewShowOptionImage) {
            const elements = document.querySelectorAll(".wf-wishlist-collection-icon-modal.wf-img");
            elements.forEach(element => {
                element.innerHTML = updateWishlistIconCollection// Replace "Your HTML content here" with the HTML you want to add
            });
        }
        if (collectionBtnSetting.isQuickViewShowOptionAddToCart) {
            if (currentCollectionSeting.quickViewShowOptionAddToCart === 'icon-below') {
                const cartBelowIcn = document.querySelectorAll(`.wf-wishlist-collection-icon-modal.wf-cart`)
                cartBelowIcn[0].innerHTML = updateWishlistIconCollectionCart
                const cartBelowAddIcn = document.querySelector(themeSelectors.modalbuttonAppend)
                cartBelowAddIcn.parentNode.style.flexDirection = "column";
            } else {
                const cartAboveIcn = document.querySelector(themeSelectors.modalbuttonAppend).previousSibling;
                const cartAboveAddIcn = document.querySelector(themeSelectors.modalbuttonAppend)
                cartAboveAddIcn.parentNode.style.flexDirection = "column";
                cartAboveIcn.innerHTML = updateWishlistIconCollectionCart.innerHTML
            }
        }
    } else {
        const addToWishlistData = await renderButtonAddToWishlist(selectedId, isCollectionCount);
        const alreadyAddedToWishlistData = await renderButtonAddedToWishlist(selectedId, isCollectionCount);

        let getModalButton = document.querySelectorAll('.wf-wishlist-collection-icon-modal');
        let addWishlistModalButton = document.createElement("div");
        addWishlistModalButton.style.zIndex = "10";
        addWishlistModalButton.style.position = "relative";
        addWishlistModalButton.innerHTML = addedText === 'added' ? `<div onClick="collectionIconClickModal(event,${selectedId}, '${productHandle}')" class="modalButtonCollection" >${alreadyAddedToWishlistData}</div>` : `<div onClick="collectionIconClickModal(event,${selectedId}, '${productHandle}')" class="modalButtonCollection" >${addToWishlistData}</div>`

        if (currentCollectionSeting.quickViewShowOption === 'button-below') {
            const dddd = document.querySelector(themeSelectors.modalbuttonAppend).nextSibling
            dddd.innerHTML = addWishlistModalButton.innerHTML
        } else {
            const dddd1 = document.querySelector(themeSelectors.modalbuttonAppend).previousSibling;
            dddd1.innerHTML = addWishlistModalButton.innerHTML
        }
    }
};

async function collectionIconClickModal(event, selectedId, handle) {
    const modalElementSelector = document.querySelector(modalProductElement);
    const actionsWithCartAdd = modalElementSelector.querySelectorAll('[action="/cart/add"]');
    let productVariantValue;
    actionsWithCartAdd.forEach(action => {
        const variantInputCandidate = action.querySelector('.product-variant-id');
        if (variantInputCandidate) {
            productVariantValue = variantInputCandidate.value;
            return;
        }
    });
    if (currentPlan >= 2) {
        try {
            const response = await fetch(`${wfGetDomain}products/${handle}.js`);
            const jsonData = await response.json();
            if (settingCurrentFilter === "boost") {
                jsonData.variants.find((variant, i) => {
                    if (Object.keys(variantIds).length === 0) {
                        productVariantValue = jsonData.variants[0].id;
                    } else if (variantIds.includes(variant.title)) {
                        productVariantValue = variant.id;
                    }
                });
            }
            const currentVariantImg = jsonData.variants.find((variant) => {
                if (variant.id === Number(productVariantValue))
                    return variant;
            });
            const filteredImages = jsonData.images.filter((image) => {
                return image.id === currentVariantImg.image_id;
            });
            if (filteredImages.length === 0 && jsonData.images.length > 0) {
                filteredImages.push(jsonData.images[0]);
            }
            let data = {
                productId: jsonData.id,
                variantId: productVariantValue,
                price: currentVariantImg.price,
                handle: jsonData.handle,
                title: jsonData.title,
                image: filteredImages.length != 0 ? filteredImages[0] : "",
                quantity: 1,
                language: wfGetDomain
            }
            let result = await SqlFunction(data);
            if (result.msg === "item added") {
                alertToast(`${customLanguage.addToWishlistNotification}`);
                collectionBtnAddedRemoveWishlist(selectedId, handle, "added")
                customIconAddedRemoveToWishlist(selectedId, "filter")
                buttonAddedRemoveWishlist(selectedId, "added")
                injectButtonAddedRemoveWishlist(selectedId, "added")
                collectionIcon(selectedId, "filter")
                showCountAll();
                (currentPlan > 1) && fxnAfterAddToWishlist();
            }
            if (result.msg === "item removed") {
                alertToast(`${customLanguage.removeFromWishlistNotification}`);
                collectionBtnAddedRemoveWishlist(selectedId, handle, "")
                customIconAddedRemoveToWishlist(selectedId, "")
                buttonAddedRemoveWishlist(selectedId, "")
                collectionIcon(selectedId, "")
                injectButtonAddedRemoveWishlist(selectedId, "")
                showCountAll();
                (currentPlan > 1) && fxnAfterRemoveFromWishlist();
            }
            if (result.msg === "limit cross") {
                alertContent(customLanguage?.quotaLimitAlert || "Wishlist Quota of this store reached its monthly limit, We have notified store owner to upgrade their plan. Sorry for the inconvenience")
            }
            wishlistIcon();
            wishlistButtonForCollection()
        } catch (error) {
            console.error("Error:", error);
        }
    } else {
        alertContent("Quick Add is not added to your plan.. Please Contact site administrator")
    }
};

// ------------------------shared wishlist page functionality------------------------

function isIconTypeValid(iconType) {
    const validIconTypes = [
        "heartSolid",
        "heartBlank",
        "starSolid",
        "starBlank",
        "saveSolid",
        "saveBlank",
        "comboHeart",
        "comboStar",
        "comboSave",
    ];
    const isValidate = validIconTypes.includes(iconType);
    return isValidate;
}

function getFontWt(headingText, bodyText) {
    const fontWeights = {
        light: 200,
        normal: 400,
        "semi-bold": 600,
        bold: "bold",
        bolder: "bolder",
    };

    // generalSetting?.wlHeadingFontWt, generalSetting?.wlTextFontWt

    const headingFw = fontWeights[headingText] || 600;
    const textFw = fontWeights[bodyText] || 400;
    return { headingFw, textFw };
}

function styleForTooltipArrow() {
    let addd = 5 + parseInt(generalSetting.borderInput);
    let subb = 4 - generalSetting.borderInput;
    let cccc = 6 + parseInt(generalSetting.borderInput);
    let notificationStyle = document.createElement("style");
    notificationStyle.innerHTML = `
  .tooltiptext-above::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: ${generalSetting.notificationBorderColor} transparent transparent transparent;
    }
    .tooltiptext-above::before{
      content: "";
      position: absolute;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      top: 99%;
      left: 50%;
      border-top: ${generalSetting.borderInput}${generalSetting.borderInputUnit} ${generalSetting.borderType} ${generalSetting.notificationBorderColor};
      border-width: ${addd}${generalSetting.borderInputUnit};
      margin-left: -${cccc}${generalSetting.borderInputUnit};
      border-color: ${generalSetting.bgColor} transparent transparent transparent;
  }
  .tooltiptext-below::after {
      content: "";
      position: absolute;
      bottom: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: transparent transparent ${generalSetting.notificationBorderColor} transparent;
  }
  .tooltiptext-below::before{
      content: "";
      position: absolute;
      bottom: 100%;
      left: 50%;
      margin-left: -${cccc}${generalSetting.borderInputUnit};
      border-width: ${cccc}${generalSetting.borderInputUnit};
      border-style: solid;
      border-color: transparent transparent ${generalSetting.notificationBorderColor} transparent;
   }`;
    document.getElementsByTagName("head")[0].appendChild(notificationStyle);
};

function notificationOfRemoved() {

    console.log("notificationOfRemoved --")

    const notificationStyle = notificationStyleFxn();
    const notificationTextStyle = notificationTextStyleFxn()
    const notificationDivId = document.getElementById("notificationDiv")
    const notificationAbove = document.querySelector('.wf-text-notification-above')
    const notificationBelow = document.querySelector('.wf-text-notification-below')
    styleForTooltipArrow();
    if (generalSetting.wishlistOrNotification === "show-wishlist") {
        // console.log("item removed");
    }
    if (generalSetting.wishlistOrNotification === "show-notification") {
        if (generalSetting.notificationTypeOption === "toast-center") {
            notificationDivId.style.display = "block";
            let toastCenter = `<div style="${notificationStyle}" class="toast-bottom-center toast-alignment">${customLanguage.removeFromWishlistNotification}</div>`;
            notificationDivId.innerHTML = toastCenter;
        }
        else if (generalSetting.notificationTypeOption === "toast-left") {
            notificationDivId.style.display = "block";
            let toastLeft = `<div style="${notificationStyle}" class="toast-bottom-left toast-alignment">${customLanguage.removeFromWishlistNotification}</div>`;
            notificationDivId.innerHTML = toastLeft;
        }
        else if (generalSetting.notificationTypeOption === "toast-right") {
            notificationDivId.style.display = "block";
            let toastRight = `<div style="${notificationStyle}" class="toast-bottom-right toast-alignment">${customLanguage.removeFromWishlistNotification}</div>`;
            notificationDivId.innerHTML = toastRight;
        }
        else if (generalSetting.notificationTypeOption === "toast-top-right") {
            notificationDivId.style.display = "block";
            let toastRight = `<div style="${notificationStyle}" class="toast-top-right toast-alignment">${customLanguage.removeFromWishlistNotification}</div>`;
            notificationDivId.innerHTML = toastRight;
        }
        else if (generalSetting.notificationTypeOption === "toast-top-left") {
            notificationDivId.style.display = "block";
            let toastRight = `<div style="${notificationStyle}" class="toast-top-left toast-alignment">${customLanguage.removeFromWishlistNotification}</div>`;
            notificationDivId.innerHTML = toastRight;
        }
        else if (generalSetting.notificationTypeOption === "toast-top-center") {
            notificationDivId.style.display = "block";
            let toastRight = `<div style="${notificationStyle}" class="toast-top-center toast-alignment">${customLanguage.removeFromWishlistNotification}</div>`;
            notificationDivId.innerHTML = toastRight;
        }
        // notificationTextStyle
        else if (generalSetting.notificationTypeOption === "text-above") {
            notificationAbove.style.display = "block"
            let tooltipAbove = `<span style="${notificationStyle}" class="text-above" >${customLanguage.removeFromWishlistNotification}</span>`;
            document.querySelector('.wf-text-notification-above').innerHTML = tooltipAbove;
        }
        else if (generalSetting.notificationTypeOption === "text-below") {
            notificationBelow.style.display = "block"
            let tooltipRight = `<span style="${notificationStyle}" class="text-bottom" >${customLanguage.removeFromWishlistNotification}</span>`;
            document.querySelector('.wf-text-notification-below').innerHTML = tooltipRight;
        }
        else if (generalSetting.notificationTypeOption === "tool-tip-above") {
            let tooltipAbove = `<span style="${notificationStyle}" class="tooltiptext-above">${customLanguage.removeFromWishlistNotification}</span>`;
            document.querySelector(".tooltip-above").innerHTML = tooltipAbove;
        }
        else {
            let tooltipBelow = `<span style="${notificationStyle}" class="tooltiptext-below">${customLanguage.removeFromWishlistNotification}</span>`;
            document.querySelector(".tooltip-below").innerHTML = tooltipBelow;
        }
    }
    clearNotification();
};

function notificationOfAdded() {

    console.log("notificationOfAdded ---")


    const notificationDivId = document.getElementById("notificationDiv")
    const notificationAbove = document.querySelector('.wf-text-notification-above')
    const notificationBelow = document.querySelector('.wf-text-notification-below')
    const notificationStyle = notificationStyleFxn();
    const notificationTextStyle = notificationTextStyleFxn()
    styleForTooltipArrow();
    if (generalSetting.wishlistOrNotification === "show-wishlist") {
        heartButtonHandle();
    }
    if (generalSetting.wishlistOrNotification === "show-notification") {
        if (generalSetting.notificationTypeOption === "toast-center") {
            notificationDivId.style.display = "block";
            let toastCenter = `<div style="${notificationStyle}" class="toast-bottom-center toast-alignment">${customLanguage.addToWishlistNotification}</div>`;
            notificationDivId.innerHTML = toastCenter;
        }
        else if (generalSetting.notificationTypeOption === "toast-left") {
            notificationDivId.style.display = "block";
            let toastLeft = `<div style="${notificationStyle}" class="toast-bottom-left toast-alignment">${customLanguage.addToWishlistNotification}</div>`;
            notificationDivId.innerHTML = toastLeft;
        }
        else if (generalSetting.notificationTypeOption === "toast-right") {
            notificationDivId.style.display = "block";
            let toastRight = `<div style="${notificationStyle}" class="toast-bottom-right toast-alignment">${customLanguage.addToWishlistNotification}</div>`;
            notificationDivId.innerHTML = toastRight;
        }
        else if (generalSetting.notificationTypeOption === "toast-top-right") {
            notificationDivId.style.display = "block";
            let toastRight = `<div style="${notificationStyle}" class="toast-top-right toast-alignment">${customLanguage.addToWishlistNotification}</div>`;
            notificationDivId.innerHTML = toastRight;
        }
        else if (generalSetting.notificationTypeOption === "toast-top-left") {
            notificationDivId.style.display = "block";
            let toastRight = `<div style="${notificationStyle}" class="toast-top-left toast-alignment ">${customLanguage.addToWishlistNotification}</div>`;
            notificationDivId.innerHTML = toastRight;
        }
        else if (generalSetting.notificationTypeOption === "toast-top-center") {
            notificationDivId.style.display = "block";
            let toastRight = `<div style="${notificationStyle}" class="toast-top-center toast-alignment">${customLanguage.addToWishlistNotification}</div>`;
            notificationDivId.innerHTML = toastRight;
        }

        // notificationTextStyle
        else if (generalSetting.notificationTypeOption === "text-above") {
            notificationAbove.style.display = "block"
            let tooltipAbove = `<span style="${notificationStyle}" class="text-above" >${customLanguage.addToWishlistNotification}</span>`;
            document.querySelector('.wf-text-notification-above').innerHTML = tooltipAbove;
        }
        else if (generalSetting.notificationTypeOption === "text-below") {
            notificationBelow.style.display = "block"
            let tooltipBelow = `<span style="${notificationStyle}" class="text-bottom" >${customLanguage.addToWishlistNotification}</span>`;
            document.querySelector('.wf-text-notification-below').innerHTML = tooltipBelow;
        }
        else if (generalSetting.notificationTypeOption === "tool-tip-above") {
            let tooltipAbove = `<span style="${notificationStyle}" class="tooltiptext-above">${customLanguage.addToWishlistNotification}</span>`;
            document.querySelector(".tooltip-above").innerHTML = tooltipAbove;
        }
        else {
            let tooltipBelow = `<span style="${notificationStyle}" class="tooltiptext-below">${customLanguage.addToWishlistNotification}</span>`;
            document.querySelector(".tooltip-below").innerHTML = tooltipBelow;
        }
    }
    clearNotification();
};

function clearNotification() {
    const notificationDivId = document.getElementById("notificationDiv")
    setTimeout(() => {
        document.getElementById("notificationDiv").innerHTML = "";
        document.querySelector(".tooltip-above").innerHTML = "";
        document.querySelector(".tooltip-below").innerHTML = "";
        document.querySelector('.our-sweetalert').innerHTML = "";
        notificationDivId.style.display = "block";

        const notificationAbove = document.querySelector('.wf-text-notification-above')
        const notificationBelow = document.querySelector('.wf-text-notification-below')
        if (notificationAbove) {
            document.querySelector('.wf-text-notification-above').style.display = "none";
            document.querySelector('.wf-text-notification-above').innerHTML = "";
        }
        if (notificationBelow) {
            document.querySelector('.wf-text-notification-below').style.display = "none";
            document.querySelector('.wf-text-notification-below').innerHTML = "";
        }
    }, Number(generalSetting.notificationTimer) * 1000);
};


async function openShareWishlistModal() {
    let addLinkContent = document.querySelectorAll(".modal-inside");
    for (let i = 0; i < addLinkContent.length; i++) {
        addLinkContent[i].innerHTML = "Loading...";
    }
    spanLink.onclick = function () {
        modalLink.style.display = "none";
    };
    modalLink.style.display = "block";
    createShareWishlistLink();
}

// async function wishlistUrlCreator() {
//     var pageUrl;
//     await getIdToShareWishlist().then((res) => {
//         pageUrl = `${wfGetDomain}apps/wg-wishlist?id=${res}`;
//     });
//     return pageUrl;
// }

async function wishlistUrlCreator(sharedName) {
    var pageUrl;
    await getIdToShareWishlist().then((res) => {
        pageUrl = `${wfGetDomain}apps/wg-wishlist?id=${res}&&name=${sharedName}`;
    });

    return pageUrl;
}

function renderBorder(msg, isCountValid) {
    if (!isCountValid) return;

    const wishlistDiv = document.getElementById("wishlist-guru");
    const injectDiv = document.getElementById("inject_wish_button");

    const borderColor =
        msg === "added"
            ? `${customButton.activeBtn.border.value}${customButton.activeBtn.border.unit} ${customButton.activeBtn.border.type} ${customButton.activeBtn.border.color}`
            : `${customButton.border.value}${customButton.border.unit} ${customButton.border.type} ${customButton.border.color}`;

    const textColor =
        msg === "added" ? customButton.activeBtn.textColor : customButton.textColor;

    const helloBgColor =
        msg === "added"
            ? onlyTextButton
                ? "transparent"
                : customButton.activeBtn.bgColor
            : onlyTextButton
                ? "transparent"
                : customButton.bgColor;

    const isIconType = customButton.type === "icon";
    const activeColor =
        customButton?.activeBtn?.iconColor?.color ||
        filterToHex(customButton?.activeBtn?.iconColor);
    const defaultColor =
        customButton?.iconColor?.color || filterToHex(customButton?.iconColor);

    const bgColor =
        msg === "added"
            ? isIconType
                ? activeColor
                : textColor
            : isIconType
                ? defaultColor
                : textColor;

    const setDivStyles = (div, border) => {
        if (!div) return;

        if (onlyTextButton) {
            div.style.backgroundColor = helloBgColor;
            div.style.color = bgColor;
        } else {
            div.style.backgroundColor = bgColor;
        }
        div.style.border = !onlyTextButton ? border : "";
    };

    const setCountStyles = () => {
        const countDiv = document.querySelector(
            "#wishlist-guru .wf-product-count, #inject_wish_button .wf-product-count"
        )
        if (!countDiv) return;
        if (onlyTextButton) {
            countDiv.style.color = bgColor;
        } else {
            countDiv.style.color = helloBgColor;
        }
        countDiv.style.fontSize = `${customButton.fontSize.value}${customButton.fontSize.unit}`;
        countDiv.style.fontFamily = `${customButton.fontFamily}`;
        countDiv.style.borderRadius = `0 ${customButton.borderRadius.value}${customButton.borderRadius.unit} ${customButton.borderRadius.value}${customButton.borderRadius.unit} 0`;
    };

    setDivStyles(wishlistDiv, borderColor);
    setDivStyles(injectDiv, borderColor);
    setCountStyles();
}

function renderCollectionTextColor(msg, proId, isCollectionCount) {
    if (isCollectionCount) {
        const countDiv = document.querySelector(
            `.wf-wishlist[product-id='${proId}'] .wf-product-count`
        );
        const countDivAutoInject = document.querySelector(
            `.wf-wishlist-collection-icon[product-id='${proId}'] .wf-product-count`
        );
        const { isComboIcon } = checkCollectionIcon();
        const iconSelectedColor = isComboIcon
            ? collectionBtnSetting?.iconDefaultColor?.color
                ? collectionBtnSetting?.iconDefaultColor?.color
                : filterToHex(collectionBtnSetting?.iconDefaultColor)
            : collectionBtnSetting?.iconSelectedColor?.color
                ? collectionBtnSetting?.iconSelectedColor?.color
                : filterToHex(collectionBtnSetting?.iconSelectedColor);

        if (msg === "added") {
            countDiv && (countDiv.style.color = iconSelectedColor);
            countDivAutoInject &&
                (countDivAutoInject.style.color = iconSelectedColor);
        } else {
            countDiv &&
                (countDiv.style.color = collectionBtnSetting?.iconDefaultColor?.color
                    ? collectionBtnSetting?.iconDefaultColor?.color
                    : filterToHex(collectionBtnSetting?.iconDefaultColor));
            countDivAutoInject &&
                (countDivAutoInject.style.color = collectionBtnSetting?.iconDefaultColor
                    ?.color
                    ? collectionBtnSetting?.iconDefaultColor?.color
                    : filterToHex(collectionBtnSetting?.iconDefaultColor));
        }
    }
}

function renderCustomButtonBorder(msg, proId, isCountValid) {
    if (!isCountValid) return;

    const getSelector = (selector) => document.querySelector(`${selector}[product-id='${proId}']`);
    const mainButtonBox = getSelector(".wf-wishlist-button");
    const mainColButtonBox = getSelector(".wf-wishlist-collection-btn");

    const isAdded = msg === "added";
    const bgColor = onlyTextButton
        ? "transparent"
        : isAdded
            ? customButton.activeBtn.bgColor
            : customButton.bgColor;
    const textColor = isAdded
        ? customButton.activeBtn.textColor
        : customButton.textColor;
    const border = !onlyTextButton
        ? `${isAdded
            ? customButton.activeBtn.border.value
            : customButton.border.value
        }${customButton.border.unit} ${customButton.border.type} ${isAdded
            ? customButton.activeBtn.border.color
            : customButton.border.color
        }`
        : "none";
    const iconColor =
        customButton.type === "icon"
            ? (isAdded ? customButton.activeBtn.iconColor : customButton.iconColor)
                .color ||
            filterToHex(
                isAdded ? customButton.activeBtn.iconColor : customButton.iconColor
            )
            : textColor;

    const applyStyles = (element) => {
        if (!element) return;
        element.style.backgroundColor = onlyTextButton ? "transparent" : iconColor;
        element.style.border = border;
    };

    applyStyles(mainButtonBox);
    applyStyles(mainColButtonBox);

    const applyCountDivStyles = (countDiv) => {
        if (!countDiv) return;
        countDiv.style.color = onlyTextButton ? textColor : bgColor;
        countDiv.style.fontSize = `${customButton.fontSize.value}${customButton.fontSize.unit}`;
        countDiv.style.fontFamily = `${customButton.fontFamily}, ${getFontFamily}, ${getFontFamilyFallback}`;
        countDiv.style.borderRadius = `0 ${customButton.borderRadius.value}${customButton.borderRadius.unit} ${customButton.borderRadius.value}${customButton.borderRadius.unit} 0`;
    };

    applyCountDivStyles(mainButtonBox?.querySelector(".wf-product-count"));
    applyCountDivStyles(mainColButtonBox?.querySelector(".wf-product-count"));
}

function filterToHex(filterColor) {
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.filter = filterColor;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return (
        "#" +
        ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()
    );
}

function getAccessToken() {
    let accessToken;
    if (localStorage.getItem("access-token") === null) {
        const newDATE = new Date();
        const formattedDateTime = newDATE.toISOString().replace(/[-:T.]/g, '').slice(0, 14);

        accessToken = btoa((Math.random() + 1).toString(36).substring(2) + formattedDateTime);
        localStorage.setItem("access-token", accessToken);
    } else {
        accessToken = localStorage.getItem("access-token");
    }
    let accessEmail;
    if (localStorage.getItem("customer-email") === null) {
        accessEmail = customerEmail;
        localStorage.setItem("customer-email", customerEmail);
    }
    else {
        if (localStorage.getItem("customer-email") === customerEmail) {
            accessEmail = localStorage.getItem("customer-email");
        }
        else {
            if (localStorage.getItem("customer-email") !== "" && customerEmail === "") {
                accessEmail = localStorage.getItem("customer-email");
            }
            else {
                if (localStorage.getItem("customer-email") !== "" && localStorage.getItem("customer-email") !== customerEmail) {
                    accessEmail = customerEmail;
                    localStorage.setItem("customer-email", customerEmail);
                }
                else {
                    accessEmail = customerEmail;
                    localStorage.setItem("customer-email", customerEmail);
                }
            }
        }
    }
    return { accessToken, accessEmail }
}

function openShareWishlistModalLink() {
    var pageUrl = wishlistUrlCreator();
    copyUrl(`${pageUrl}`);
}

// async function createShareWishlistLink() {
//     let linkDivHeading = document.querySelectorAll(".sharable-link-heading");
//     for (let j = 0; j < linkDivHeading.length; j++) {
//         linkDivHeading[j].innerHTML = `${customLanguage.sharableLinkModalHeading}`;
//     }
//     getCurrentLoginFxn().then(async (resss) => {
//         let sendID;
//         if (resss === "") {
//             sendID = localStorage.getItem("access-token");
//         } else {
//             sendID = resss;
//         }
//         try {
//             const getIdFromEmail = await fetch(`${serverURL}/get-id-from-email`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     shopName: permanentDomain,
//                     email: sendID,
//                     shopDomain: shopDomain,
//                 }),
//             });
//             let result = await getIdFromEmail.json();
//             let getID = result.data[0].id;
//             let encryptedEmail = btoa(getID);
//             let advanceEncryptedEmail = `${encryptedEmail}`;
//             let pageUrl;
//             pageUrl = `${wfGetDomain}apps/wg-wishlist?id=${advanceEncryptedEmail}`;
//             let pageUrlDiv = `<div class="share-url-div">  <div class="share-url-text" >${pageUrl}</div>  <div><div  onClick="copyUrl( '${pageUrl}' )" class="deleteIconStyle copyICON"><span></span></div></div>   <div>`;
//             let addLinkContent = document.querySelectorAll(".modal-inside");
//             for (let i = 0; i < addLinkContent.length; i++) {
//                 addLinkContent[i].innerHTML = pageUrlDiv;
//             }
//         } catch (error) {
//             console.log("errr ", error);
//             let addLinkContent = document.querySelectorAll(".modal-inside");
//             for (let i = 0; i < addLinkContent.length; i++) {
//                 addLinkContent[i].innerHTML =
//                     "Firstly add items to your wishlist to share";
//             }
//         }
//     });
//     await Conversion("url");
// }

async function createShareWishlistLink() {
    document.querySelectorAll(".sharable-link-heading").forEach((element) => {
        element.innerHTML = customLanguage.sharableLinkModalHeading;
    });

    const sendID = await getCurrentLoginFxn() || localStorage.getItem("access-token");

    try {
        const response = await fetch(`${serverURL}/get-id-from-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                shopName: permanentDomain,
                email: sendID,
                shopDomain: shopDomain,
            }),
        });

        const result = await response.json();
        const getID = result.data?.[0]?.id;

        if (!getID) throw new Error("User ID not found");

        const encryptedEmail = btoa(getID);
        const encryptedName = btoa('url');
        const pageUrl = `${wfGetDomain}apps/wg-wishlist?id=${encryptedEmail}&&name=${encryptedName}`;
        await Conversion("url", getID, "noReload");

        const pageUrlDiv = `
            <div class="share-url-div">
                <div class="share-url-text">${pageUrl}</div>
                <div class="deleteIconStyle copyICON" onClick="copyUrl('${pageUrl}')">
                    <span></span>
                </div>
            </div>
        `;

        document.querySelectorAll(".modal-inside").forEach((element) => {
            element.innerHTML = pageUrlDiv;
        });
    } catch (error) {
        console.error("Error: ", error);

        const fallbackMessage = "Firstly add items to your wishlist to share";
        document.querySelectorAll(".modal-inside").forEach((element) => {
            element.innerHTML = fallbackMessage;
        });
    }
}

function copyUrl(data) {
    navigator.clipboard.writeText(data);
    alertToast(`${customLanguage.alertForLinkCopied}`);
}

function notificationStyleFxn() {
    const notificationStyle = `background-color: ${generalSetting.notificationTypeOption === "text-below" ||
        generalSetting.notificationTypeOption === "text-above"
        ? "transparent"
        : generalSetting.bgColor
        };  
    color: ${generalSetting.textColor}; 
    max-width: 90%;
    border: ${generalSetting.notificationTypeOption === "text-below" ||
            generalSetting.notificationTypeOption === "text-above"
            ? "none"
            : `${generalSetting.borderInput}${generalSetting.borderInputUnit} ${generalSetting.borderType} ${generalSetting.notificationBorderColor}`
        };
    border-radius: ${generalSetting.borderRadius}${generalSetting.borderRadiusUnit
        }; 
    font-size: ${generalSetting.fontSize}${generalSetting.fontSizeUnit}; 
    
    padding: ${generalSetting.paddingTopBottom}${generalSetting.paddingTopBottomUnit
        } ${generalSetting.paddingLeftRight}${generalSetting.paddingLeftRightUnit}; 
    margin: ${generalSetting.marginTopBottom}${generalSetting.marginTopBottomUnit
        } ${generalSetting.marginLeftRight}${generalSetting.marginLeftRightUnit};
    text-align: ${generalSetting.textAlign};
    ${generalSetting?.fontFamily
            ? `font-family: ${generalSetting?.fontFamily} !important;`
            : ""
        }

`;

    return notificationStyle;
}

function notificationTextStyleFxn() {
    const notificationextStyle = `
    color: ${generalSetting.textColor}; 
    font-size: ${generalSetting.fontSize}${generalSetting.fontSizeUnit};
    ${generalSetting?.fontFamily
            ? `font-family: ${generalSetting?.fontFamily} !important;`
            : ""
        }
    padding: ${generalSetting.PaddingTopBottom}${generalSetting.PaddingTopBottomUnit
        } ${generalSetting.paddingLeftRight}${generalSetting.paddingLeftRightUnit};  
    margin: ${generalSetting.marginTopBottom}${generalSetting.marginTopBottomUnit
        } ${generalSetting.marginLeftRight}${generalSetting.marginLeftRightUnit};
    text-align: ${generalSetting.textAlign};`;
    return notificationextStyle;
}

function alertContent(text) {
    const notificationStyle = notificationStyleFxn();
    if (generalSetting.notificationTypeOption === "toast-left") {
        let toastLeft = `<div style="${notificationStyle}" class="toast-bottom-left toast-alignment"><span class="alert-cross-icon" onClick="closeNortiFxn()">X</span> ${text}</div>`;
        document.querySelector(".our-sweetalert").innerHTML = toastLeft;
    } else if (generalSetting.notificationTypeOption === "toast-right") {
        let toastRight = `<div style="${notificationStyle}" class="toast-bottom-right toast-alignment"><span class="alert-cross-icon" onClick="closeNortiFxn()">X</span> ${text}</div>`;
        document.querySelector(".our-sweetalert").innerHTML = toastRight;
    } else if (generalSetting.notificationTypeOption === "toast-top-right") {
        let toastRight = `<div style="${notificationStyle}" class="toast-top-right toast-alignment"><span class="alert-cross-icon" onClick="closeNortiFxn()">X</span> ${text}</div>`;
        document.querySelector(".our-sweetalert").innerHTML = toastRight;
    } else if (generalSetting.notificationTypeOption === "toast-top-left") {
        let toastRight = `<div style="${notificationStyle}" class="toast-top-left toast-alignment"><span class="alert-cross-icon" onClick="closeNortiFxn()">X</span> ${text}</div>`;
        document.querySelector(".our-sweetalert").innerHTML = toastRight;
    } else if (generalSetting.notificationTypeOption === "toast-top-center") {
        let toastRight = `<div style="${notificationStyle}" class="toast-top-center toast-alignment"><span class="alert-cross-icon" onClick="closeNortiFxn()">X</span> ${text}</div>`;
        document.querySelector(".our-sweetalert").innerHTML = toastRight;
    } else {
        let toastCenter = `<div style="${notificationStyle} background-color: ${generalSetting.bgColor};" class="toast-bottom-center toast-alignment"><span class="alert-cross-icon" onClick="closeNortiFxn()">X</span> ${text}</div>`;
        document.querySelector(".our-sweetalert").innerHTML = toastCenter;
    }
    setTimeout(() => {
        document.querySelector(".our-sweetalert").innerHTML = "";
    }, 1 * 60 * 1000);
}

function closeNortiFxn() {
    document.querySelector(".our-sweetalert").innerHTML = "";
}

// --------------------- additional alert toast  ----------------
function alertToast(text, msgggg) {
    if (generalSetting.wishlistOrNotification === "show-wishlist") {
        if (msgggg === "added") {
            heartButtonHandle();
        }
    } else {
        const notificationStyle = notificationStyleFxn();
        if (generalSetting.notificationTypeOption === "toast-left") {
            let toastLeft = `<div style="${notificationStyle}" class="toast-bottom-left toast-alignment">${text}</div>`;
            document.querySelector(".our-sweetalert").innerHTML = toastLeft;
        } else if (generalSetting.notificationTypeOption === "toast-right") {
            let toastRight = `<div style="${notificationStyle}" class="toast-bottom-right toast-alignment"> ${text}</div>`;
            document.querySelector(".our-sweetalert").innerHTML = toastRight;
        } else if (generalSetting.notificationTypeOption === "toast-top-right") {
            let toastRight = `<div style="${notificationStyle}" class="toast-top-right toast-alignment">${text}</div>`;
            document.querySelector(".our-sweetalert").innerHTML = toastRight;
        } else if (generalSetting.notificationTypeOption === "toast-top-left") {
            let toastRight = `<div style="${notificationStyle}" class="toast-top-left toast-alignment">${text}</div>`;
            document.querySelector(".our-sweetalert").innerHTML = toastRight;
        } else if (generalSetting.notificationTypeOption === "toast-top-center") {
            let toastRight = `<div style="${notificationStyle}" class="toast-top-center toast-alignment">${text}</div>`;
            document.querySelector(".our-sweetalert").innerHTML = toastRight;
        } else {
            let toastCenter = `<div style="${notificationStyle} background-color: ${generalSetting.bgColor}; " class="toast-bottom-center toast-alignment">${text}</div>`;
            document.querySelector(".our-sweetalert").innerHTML = toastCenter;
        }
        setTimeout(() => {
            document.querySelector(".our-sweetalert").innerHTML = "";
        }, Number(generalSetting.notificationTimer) * 1000);
    }
}

function addToMyCart(variantId, userId) {
    data = {
        id: variantId,
        quantity: 1,
    };
    alertToast(`${customLanguage.sharedPageAddToCart}`);
    cartFunction(data);
}

function drawerModal() {
    modalDrawer.style.display = "block";
    spanDrawer.onclick = function () {
        modalDrawer.style.display = "none";
    };
    createShareWishlistLink();
}

var btn = document.querySelector("button.shareModalById");
var spans = document.getElementsByClassName("closeByShareModal")[0];

function showShareModal() {
    shareModal.style.display = "flex";
}

if (btn != null) {
    btn.addEventListener("click", showShareModal);
}

spans.onclick = function () {
    closeShareModal();
};

window.onclick = function (event) {
    if (event.target == modalWF) {
        shareModal.style.display = "none";
        document.querySelector(".searchData input").value = "";
    }
};

window.onkeydown = function (event) {
    if (event.key === "Escape") {
        closeShareModal();
    }
};

function openShareModal() {
    shareModal.style.display = "block";
    shareModalContent.style.display = "block";
    shareModalContent.innerHTML = `<div class="loader-css" ><span> </span></div>`

    pageTypeFunction();
}

function closeShareModal() {
    document.getElementById("textEmailName").value = "";
    document.getElementById("textEmail").value = "";
    document.getElementById("textEmailRecieverName").value = "";
    document.getElementById("textEmailMessage").value = "";
    document.getElementById("error-message").innerText = "";
    shareModal.style.display = "none";
}


async function extractIdAndGetDataForTable(pageUrl) {
    let params = (new URL(pageUrl)).searchParams;
    let sharedId = params.get("id");
    let allData = await getSharedWishlistData(sharedId)
    let tableStructure = '<div>';
    for (const key in allData) {
        const arrayName = Object.keys(allData[key])[0];
        const items = allData[key][arrayName];

        if (permanentDomain === 'l-a-girl-cosmetics.myshopify.com') {
            items.forEach(item => {
                tableStructure += `<p>${item?.title?.split("~")[1]}, ${item?.title?.split("~")[0]}</p>`;
            });
        } else {
            tableStructure += `<h3>${arrayName}</h3>`;
            tableStructure += `<table border="1" style="width:50%; margin-bottom: 20px; text-align: center;"><tbody>
                                <tr>
                                    <th style="text-align: center;">Image</th>
                                    <th style="text-align: center;">Title</th>
                                </tr>`;
            items.forEach(item => {
                tableStructure += `<tr>
                                    <td style="text-align: center; vertical-align: middle;">
                                        <img src="${item.image}" alt="${item.title}" style="width: 50px; height: auto;">
                                    </td>
                                    <td style="text-align: center; vertical-align: middle;">
                                        ${item.title}
                                    </td>
                                </tr>`;
            });
            tableStructure += "</tbody></table>";
        }
    }
    tableStructure += '</div>';
    return tableStructure;
};


async function replaceTokens(str, data) {
    const sharedName = btoa('email');
    var pageUrl = await wishlistUrlCreator(sharedName);
    var tableData = await extractIdAndGetDataForTable(pageUrl);
    var name = document.getElementById("textEmailName").value;
    var recieverName = document.getElementById("textEmailRecieverName").value;
    var message = document.getElementById("textEmailMessage").value;

    const defData =
        "<p><b>Hello Dear Friend!</b></p><p>##wishlist_share_email_customer_name## filled out this wishlist and asked us to forward it to you. You can simply click on the button below to see it at our online store and easily make your purchase.</p><p style=text-align: center;><a href=##wishlist_share_email_wishlist_url## style=background-color: Crimson;border-radius: 5px;color: white;padding: 0.5em;text-decoration: none;target=_blank>Go to wishlist</a></p><p>Message for you:</p><p>##wishlist_share_email_customer_message##</p>";

    const newData =
        "<p>Hello <b>{wishlist_share_email_reciever_name}!</b></p><p>{wishlist_share_email_sender_name} filled out this wishlist and asked us to forward it to you. You can simply click on the button below to see it at our online store and easily make your purchase.</p><p style=text-align: center;><a href={wishlist_share_email_wishlist_url} style=background-color: Crimson;border-radius: 5px;color: white;padding: 0.5em;text-decoration: none;target=_blank>Go to wishlist</a></p><p>Message for you:</p><p>{wishlist_share_email_customer_message}</p>";

    const defData2 =
        "<p><b>Hello Dear Friend!</b></p><p>{wishlist_share_email_customer_name} filled out this wishlist and asked us to forward it to you. You can simply click on the button below to see it at our online store and easily make your purchase.</p><p style=text-align: center;><a href={wishlist_share_email_wishlist_url} style=background-color: Crimson;border-radius: 5px;color: white;padding: 0.5em;text-decoration: none;target=_blank>Go to wishlist</a></p><p>Message for you:</p><p>{wishlist_share_email_customer_message}</p>";

    if (str === defData || str === defData2) {
        str = newData;
    }

    if (data === "subject") {
        str = str.replace(
            /##wishlist_share_email_customer_name##/g,
            `{wishlist_share_email_sender_name}`
        );
        str = str.replace(
            /{wishlist_share_email_customer_name}/g,
            `{wishlist_share_email_sender_name}`
        );
    }
    str = str.replace(/##wishlist_share_email_wishlist_url##/g, pageUrl);
    str = str.replace(/##wishlist_share_email_customer_message##/g, message);
    str = str.replace(/{wishlist_share_email_wishlist_url}/g, pageUrl);
    str = str.replace(/{wishlist_share_email_customer_message}/g, message);
    str = str.replace(/{wishlist_share_email_sender_name}/g, name);
    str = str.replace(/{wishlist_share_email_reciever_name}/g, recieverName);
    str = str.replace(/{wishlist_share_email_static_data}/g, tableData);
    str = str.replace(/<p>\s*<\/p>/g, "<br>");
    return str;
}

async function submitForm() {

    let sendButton = document.getElementById('shareListBtn');
    sendButton.disabled = true;
    sendButton.style.cursor = 'not-allowed';

    var name = document.getElementById("textEmailName").value;
    var recieverName = document.getElementById("textEmailRecieverName").value;
    var email = document.getElementById("textEmail").value;
    var message = document.getElementById("textEmailMessage").value;
    let wishlistTextEditors = await replaceTokens(
        generalSetting.wishlistTextEditor,
        "reciever"
    );
    let wishlistSubject = await replaceTokens(
        generalSetting.wishlistShareEmailSubject,
        "subject"
    );

    if (name === "" || recieverName === "" || email === "" || message === "") {
        document.getElementById("error-message").innerText = "All fields are required!";
        sendButton.disabled = false;
        sendButton.style.cursor = 'pointer';
        return;
    } else if (!isValidEmail(email)) {
        document.getElementById("error-message").innerText = "Invalid email format!";
        sendButton.disabled = false;
        sendButton.style.cursor = 'pointer';
        return;
    } else {
        sendButton.disabled = true;
        sendButton.style.cursor = 'not-allowed';

        // console.log("wishlistTextEditors --- ", wishlistTextEditors)

        try {
            const userData = await fetch(`${serverURL}/share-wishlist-by-mail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customerEmail: email,
                    customerMessage: message,
                    wishlistShareSubject: wishlistSubject,
                    wishlistTextEditor: wishlistTextEditors,
                    shopName: permanentDomain,
                }),
            });
            if (userData.status === 200) {
                const res = await getIdToShareWishlist();
                await Conversion("email", atob(res), "noReload");
                shareModalContent.style.display = "none";
                setTimeout(() => {
                    closeShareModal();
                    successDiv.style.display = "none";
                }, 3000);
                successDiv.style.display = "block";
            }
        } catch (error) {
            console.log("errr ", error);
        }
    }
    document.getElementById("error-message").innerText = "";
}


function removeError() {
    document.getElementById("error-message").innerText = "";
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function shareOnFacebook() {
    const popupWidth = 600;
    const popupHeight = 400;
    const leftPosition = (window.screen.width - popupWidth) / 2;
    const topPosition = (window.screen.height - popupHeight) / 2;
    let popup = window.open(
        "about:blank",
        "_blank",
        "width=" +
        popupWidth +
        ", height=" +
        popupHeight +
        ", left=" +
        leftPosition +
        ", top=" +
        topPosition
    );
    if (!popup) {
        alert("Please enable pop-ups in your browser to share this link.");
        return;
    }
    let message = localStorage.getItem("textEmailMessage");
    const sharedName = btoa("facebook")
    let pageUrl = await wishlistUrlCreator(sharedName);

    const res = await getIdToShareWishlist();
    await Conversion("facebook", atob(res), "noReload");

    let facebookShareUrl = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(pageUrl);
    if (message) {
        facebookShareUrl += "&quote=" + encodeURIComponent(message);
    }
    popup.location.href = facebookShareUrl;
}

async function shareOnTwitter() {
    const popupWidth = 600;
    const popupHeight = 400;
    const leftPosition = (window.screen.width - popupWidth) / 2;
    const topPosition = (window.screen.height - popupHeight) / 2;
    let popup = window.open(
        "about:blank",
        "_blank",
        `width=${popupWidth}, height=${popupHeight}, left=${leftPosition}, top=${topPosition}`
    );
    if (!popup) {
        alert("Please enable pop-ups in your browser to share this link.");
        return;
    }
    const sharedName = btoa("twitter_x")
    const res = await getIdToShareWishlist();
    await Conversion("twitter_x", atob(res), "noReload");
    let shareUrl = `${wfGetDomain}apps/wg-wishlist?id=${res}&&name=${sharedName}`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
    )}`;
    popup.location.href = twitterShareUrl;
    document.getElementById("textEmailMessage").value = "";
}

async function shareOnFbMessenger() {
    const sharedName = btoa("fb_messenger")
    const res = await getIdToShareWishlist();
    await Conversion("fb_messenger", atob(res), "noReload");
    let shareUrl = `${wfGetDomain}apps/wg-wishlist?id=${res}&&name=${sharedName}`;
    const messengerUrl = `https://m.me/?send?text=${encodeURIComponent(
        shareUrl
    )}`;
    const customText = `Check out this wishlist! ${shareUrl}`;

    navigator.clipboard.writeText(`${customText}`);
    alertContent(`${customLanguage.alertForLinkCopied}`);
    // copyUrl(`${customText}`);

    const popupWidth = 600;
    const popupHeight = 400;
    const leftPosition = (window.screen.width - popupWidth) / 2;
    const topPosition = (window.screen.height - popupHeight) / 2;
    let popup = window.open(
        "about:blank",
        "_blank",
        `width=${popupWidth}, height=${popupHeight}, left=${leftPosition}, top=${topPosition}`
    );
    if (!popup) {
        alert("Please enable pop-ups in your browser to share this link.");
        return;
    }
    popup.location.href = messengerUrl;
}

async function shareOnInstagram() {
    const sharedName = btoa("instagram")
    const res = await getIdToShareWishlist();
    await Conversion("instagram", atob(res), "noReload");
    let shareUrl = `${wfGetDomain}apps/wg-wishlist?id=${res}&&name=${sharedName}`;
    const messengerUrl = "https://www.instagram.com/direct/inbox/";
    const customText = `Check out this wishlist! ${shareUrl}`;

    navigator.clipboard.writeText(`${customText}`);
    alertContent(`${customLanguage.alertForLinkCopied}`);

    const popupWidth = 600;
    const popupHeight = 400;
    const leftPosition = (window.screen.width - popupWidth) / 2;
    const topPosition = (window.screen.height - popupHeight) / 2;
    let popup = window.open(
        "about:blank",
        "_blank",
        `width=${popupWidth}, height=${popupHeight}, left=${leftPosition}, top=${topPosition}`
    );
    if (!popup) {
        alert("Please enable pop-ups in your browser to share this link.");
        return;
    }
    popup.location.href = messengerUrl;
}

async function shareViaLinkedIn() {
    const popupWidth = 600;
    const popupHeight = 400;
    const leftPosition = (window.screen.width - popupWidth) / 2;
    const topPosition = (window.screen.height - popupHeight) / 2;
    let popup = window.open(
        "about:blank",
        "_blank",
        `width=${popupWidth}, height=${popupHeight}, left=${leftPosition}, top=${topPosition}`
    );
    if (!popup) {
        alert("Please enable pop-ups in your browser to share this link.");
        return;
    }
    const sharedName = btoa("linkedin")
    const res = await getIdToShareWishlist();
    await Conversion("linkedin", atob(res), "noReload");
    let shareUrl = `${wfGetDomain}apps/wg-wishlist?id=${res}&&name=${sharedName}`;
    popup.location.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
    )}&title=${encodeURIComponent(
        "This is my text"
    )}&summary=${encodeURIComponent("hello jii")}`;
}

async function shareViaTelegram() {
    const popupWidth = 600;
    const popupHeight = 400;
    const leftPosition = (window.screen.width - popupWidth) / 2;
    const topPosition = (window.screen.height - popupHeight) / 2;
    let popup = window.open(
        "about:blank",
        "_blank",
        `width=${popupWidth}, height=${popupHeight}, left=${leftPosition}, top=${topPosition}`
    );
    if (!popup) {
        alert("Please enable pop-ups in your browser to share this link.");
        return;
    }
    const sharedName = btoa("telegram")
    const res = await getIdToShareWishlist();
    await Conversion("telegram", atob(res), "noReload");
    let shareUrl = `${wfGetDomain}apps/wg-wishlist?id=${res}&&name=${sharedName}`;
    const myText = `Check out this link! ${shareUrl}`;
    let telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
        shareUrl
    )}&text=${encodeURIComponent(myText)}`;
    popup.location.href = telegramUrl;
}

async function shareViaWhatsApp() {
    const popupWidth = 600;
    const popupHeight = 400;
    const leftPosition = (window.screen.width - popupWidth) / 2;
    const topPosition = (window.screen.height - popupHeight) / 2;
    let popup = window.open(
        "about:blank",
        "_blank",
        `width=${popupWidth}, height=${popupHeight}, left=${leftPosition}, top=${topPosition}`
    );
    if (!popup) {
        alert("Please enable pop-ups in your browser to share this link.");
        return;
    }
    const sharedName = btoa("whatsapp")
    const res = await getIdToShareWishlist();
    await Conversion("whatsapp", atob(res), "noReload");
    let shareUrl = `${wfGetDomain}apps/wg-wishlist?id=${res}&&name=${sharedName}`;
    const myText = `Check out this link! ${shareUrl}`;
    popup.location.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        myText
    )}`;
}

async function Conversion(name, sendID, fromWhere) {
    try {
        const userData = await fetch(`${serverURL}/share-wishlist-stats`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: name,
                shopName: permanentDomain,
                count: 1,
                user_id: sendID,
                fromWhere: fromWhere
            }),
        });
    } catch (error) {
        console.log("errr ", error);
    }
}

function goToWebframez() {
    window.open("https://apps.shopify.com/wishlist-guru", "_blank");
}

let CheckCustomObserver = new MutationObserver(wishlistIcon);
const checkObjConfig = {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
};
CheckCustomObserver.observe(checkAllProduct, checkObjConfig);

const checkObjBtnConfig = {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
};
let CheckCustomButtonObserver = new MutationObserver(wishlistButtonForCollection);
CheckCustomButtonObserver.observe(checkButtonProduct, checkObjBtnConfig);


async function renderButtonAddToWishlist(productId, countValid) {
    const countData = await isCountOrNot(productId, countValid);
    const customAlignMargin = customButton.textAlign === "center" ? "0 auto" : customButton.textAlign === "left" ? "0" : "0 0 0 auto";

    if (customButton.type === "icon") {
        ["wishlist-guru", "inject_wish_button"].forEach(id => {
            const div = document.getElementById(id);
            if (div) {
                div.style.width = countValid ? "max-content" : "40px";
                div.style.margin = customAlignMargin;
                div.style.marginTop = "10px";
            }
        });
    }

    const animations = {
        "fade-in": "animation-fade_in",
        "fade-out": "animation-fade_out",
        "rotate": "animation-rotate",
        "shake-up": "animation-shake-up",
        "shake-side": "animation-shake-side"
    };
    const animationClass = animations[customButton.animationType] || "";
    const iconTypes = {
        "heart": "heartICON",
        "star": "starICON",
        "save": "saveICON"
    };
    const iconClass = iconTypes[customButton.iconType] || "";

    const buttonTemplates = {
        "icon": `
            <div class="iconDiv">
                <div class="iconColour ${iconClass} ${animationClass}">
                    <span class="span-hearticon"></span>
                </div>
            </div>${countData}`,
        "icon-text-button": `
            <div class="buttonStyleHead ${animationClass}">
                <div class="inside-button-div-icon iconColour ${iconClass}"></div>
                ${customLanguage.addToWishlist}
            </div>${countData}`,
        "icon-text": `
            <div style="background-color: transparent;" class="buttonStyleHead outer-icon-text-div ${animationClass}">
                <div class="inside-button-div-icon iconColour ${iconClass}"></div>
                ${customLanguage.addToWishlist}
                ${countValid ? `<span class="wf-product-count">${countData}</span>` : ""}
            </div>`,
        "text": `
            <div style="background-color: transparent;" class="buttonStyleHead wishlist-text ${animationClass}">
                ${customLanguage.addToWishlist}
                ${countValid ? `<span class="wf-product-count">${countData}</span>` : ""}
            </div>`,
        "default": `
            <div class="buttonStyleHead ${animationClass}">
                ${customLanguage.addToWishlist}
            </div>${countData}`
    };

    return buttonTemplates[customButton.type] || buttonTemplates["default"];
}

async function renderButtonAddedToWishlist(productId, countValid) {
    const countData = await isCountOrNot(productId, countValid);
    const customAlignMargin = customButton.textAlign === "center" ? "0 auto" : customButton.textAlign === "left" ? "0" : "0 0 0 auto";

    if (customButton.type === "icon") {
        ["wishlist-guru", "inject_wish_button"].forEach(id => {
            const div = document.getElementById(id);
            if (div) {
                div.style.width = countValid ? "max-content" : "40px"
                div.style.margin = customAlignMargin;
                div.style.marginTop = "10px";
            }
        });
    }

    const animations = {
        "fade-in": "animation-fade_in",
        "fade-out": "animation-fade_out",
        "rotate": "animation-rotate",
        "shake-up": "animation-shake-up",
        "shake-side": "animation-shake-side"
    };
    const animationClass = animations[customButton.animationType] || "";
    const iconTypes = {
        "heart": "heartICON2",
        "star": "starICON2",
        "save": "saveICON2"
    };
    const iconClass = iconTypes[customButton.iconType] || "";

    const buttonTemplates = {
        "icon": `
            <div class="iconDivAlready">
                <div class="alreadyIconColour ${iconClass} ${animationClass}">
                    <span class="span-hearticon"></span>
                </div>
            </div>${countData}`,
        "icon-text-button": `
            <div class="alreadyButtonStyleHead ${animationClass}">
                <div class="inside-button-div-icon alreadyIconColour ${iconClass}"></div>
                ${customLanguage.addedToWishlist}
            </div>${countData}`,
        "icon-text": `
            <div style="background-color: transparent;" class="alreadyButtonStyleHead outer-icon-text-div ${animationClass}">
                <div class="inside-button-div-icon alreadyIconColour ${iconClass}"></div>
                ${customLanguage.addedToWishlist}
                ${countValid ? `<span class="wf-product-count">${countData}</span>` : ""}
            </div>`,
        "text": `
            <div style="background-color: transparent;" class="alreadyButtonStyleHead wishlist-text ${animationClass}">
                ${customLanguage.addedToWishlist}
                ${countValid ? `<span class="wf-product-count">${countData}</span>` : ""}
            </div>`,
        "default": `
            <div class="alreadyButtonStyleHead ${animationClass}">
                ${customLanguage.addedToWishlist}
            </div>${countData}`
    };

    return buttonTemplates[customButton.type] || buttonTemplates["default"];
}

function styleFxnForApp(selectedClass, checkCondition) {
    const titleElements = document.querySelectorAll(selectedClass);
    titleElements.forEach((element) => {
        if (checkCondition === "aligncolor") {
            element.style.color = modalDrawerTextColor;
            element.style.textAlign = generalSetting.wlTextAlign;
        } else if (checkCondition === "align") {
            element.style.textAlign = generalSetting.wlTextAlign;
        } else {
            element.style.color = modalDrawerTextColor;
        }
    });
}

async function getIdToShareWishlist() {
    let saveID;
    await getCurrentLoginFxn().then(async (resss) => {
        let sendID;
        if (resss === "") {
            sendID = localStorage.getItem("access-token");
        } else {
            sendID = resss;
        }
        try {
            const getIdFromEmail = await fetch(`${serverURL}/get-id-from-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shopName: permanentDomain,
                    email: sendID,
                    shopDomain: shopDomain,
                }),
            });
            let result = await getIdFromEmail.json();
            let getID = result.data[0].id;
            let encryptedEmail = btoa(getID);
            let advanceEncryptedEmail = `${encryptedEmail}`;
            saveID = advanceEncryptedEmail;
        } catch (error) {
            console.log("errr ", error);
        }
    });
    return saveID;
}


async function isIdExist(data, pId) {
    for (let obj of data) {
        for (let key in obj) {
            for (let item of obj[key]) {
                if (parseInt(item.product_id) === pId) {
                    return true;
                }
            }
        }
    }
    return false;
}

async function isIdExistInKey(data, keyToCheck, pId) {
    for (let obj of data) {
        if (obj.hasOwnProperty(keyToCheck)) {
            for (let item of obj[keyToCheck]) {
                if (parseInt(item.product_id) === pId) {
                    return true;
                }
            }
        }
    }
    return false;
}

async function getMultiwishlistData(data) {
    const getCurrentLogin = await getCurrentLoginFxn();
    let dataToSend;
    if (data !== "") {
        dataToSend = {
            shopName: data.shopName,
            currentToken: data.guestToken,
            customerEmail: data.customerEmail,
        };
    } else {
        dataToSend = {
            shopName: permanentDomain,
            customerEmail: getCurrentLogin,
            currentToken: localStorage.getItem("access-token"),
        };
    }

    try {
        const multiData = await fetch(`${serverURL}/get-multiwishlist-data`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        });

        let result = await multiData.json();
        multiArray = result.data
        return result.data;
    } catch (err) {
        console.log(err);
    }
}

async function getDataFromSql(data) {
    let allData = [];
    const getCurrentLogin = await getCurrentLoginFxn();
    try {
        let dataToSendInBody;
        if (data !== undefined) {
            dataToSendInBody = {
                shopName: data.shopName,
                customerEmail: data.customerEmail,
                shopDomain: data.shopDomain,
                currentToken: data.guestToken,
            };
        } else {
            dataToSendInBody = {
                shopName: permanentDomain,
                customerEmail: getCurrentLogin,
                shopDomain: shopDomain,
                currentToken: localStorage.getItem("access-token"),
            };
        }
        const userData = await fetch(`${serverURL}/get-all-items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSendInBody),
        });
        let result = await userData.json();

        // ------------this is for to make the data in alphabatically order----------
        // let myArray = [];
        // result?.data?.map((data, index) => {
        //     let keyData = Object.keys(data)[0];
        //     let valueData = Object.values(data)[0];
        //     valueData.sort((a, b) => a.title.localeCompare(b.title));
        //     myArray.push({ [keyData]: valueData });
        // })
        // allData = myArray;
        // allWishlistData = myArray;

        allData = result.data;
        allWishlistData = result.data;
    } catch (error) {
        console.log("errr ", error);
        // alertContent("Something went wrong.. Please try again later");
    }
    return allData;
}

async function createLikeFromSql(productId, checkCountData, checkAddOrRemove) {
    let allData = [];
    const getCurrentLogin = await getCurrentLoginFxn();
    try {
        const userData = await fetch(`${serverURL}/create-social-like`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                shopName: permanentDomain,
                customerEmail: getCurrentLogin,
                currentToken: localStorage.getItem("access-token"),
                productId: productId,
                checkCountDecOrNot: checkCountData,
                checkAddOrRemove: checkAddOrRemove
            }),
        })
        let result = await userData.json();
    } catch (error) {
        console.log("errr ", error);
        console.log("Something went wrong.. Please try again later");
    }
    return allData;
}

function collectionIconSize() {
    let getHeight = "";
    let getWidth = "";
    let netUnit = "px";

    if (collectionBtnSetting.iconSize === "extraSmall") {
        getHeight = 17;
        getWidth = 17;
    } else if (collectionBtnSetting.iconSize === "small") {
        getHeight = 20;
        getWidth = 20;
    } else if (collectionBtnSetting.iconSize === "large") {
        getHeight = 30;
        getWidth = 30;
    } else {
        getHeight = 25;
        getWidth = 25;
    }

    const { isComboIcon } = checkCollectionIcon();
    var iconStyleCollection = document.createElement("style");

    iconStyleCollection.innerHTML = `.collection_icon_new,
        .collection_icon_new_selected{
            height: ${getHeight}${netUnit};
            width: ${getWidth}${netUnit};
            border-radius: 50%;
        }

        .wg-collectionIcon.selected{
            filter:${isComboIcon ? colIconDefaultColor : colIconSelectedColor
        } !important;
        }    
        
        .wg-collectionIcon{
            filter:${colIconDefaultColor};
            height: ${getHeight}${netUnit};
            width: ${getWidth}${netUnit};
        }

        .wg-heart-icon-blank,
        .wg-heart-icon-solid,
        .wg-heart-icon-outline-solid,
        .wg-heart-icon-outline-blank,
        .wg-heart-icon-outline-blank-11 {
            background-size: ${getHeight}${netUnit};
        }

        .wf-wishlist,
        .wf-product-count{
            height: ${getHeight}${netUnit};
            width: ${getWidth}${netUnit};
        }

        .wf-wishlist .wf-product-count{
            min-width: ${getWidth}${netUnit};
            font-weight: 500;
        }

        .wf-wishlist .collection_icon_new,
        .wf-wishlist .collection_icon_new_selected{
            position: relative !important;
        }

        .wf-wishlist-collection-icon,
        .sharedIconDiv {
            position: absolute !important;
            width: ${getWidth}${netUnit};
        }

        .wf-wishlist-collection-icon .wf-product-count{
            position: absolute;
            z-index: 10;
            height: ${getWidth}${netUnit};
            min-width: ${getWidth}${netUnit};
            font-weight: 500 !important;
        }
    `;
    document.getElementsByTagName("head")[0].appendChild(iconStyleCollection);
    return `height: ${getHeight}${netUnit}; width: ${getWidth}${netUnit}`;
}

async function checkPlanForMulti(data) {

    createFilterOptionInStructure();

    const arrayList = isMultiwishlistTrue
        ? allWishlistData
        : getWishlistByKey(allWishlistData, "favourites");

    const renderFn = data === "multi"
        ? () => renderMultiModalContentFxn(arrayList)
        : () => renderDrawerContentFxn();

    await renderFn();
}

function findArrayByKey(data, keyName) {
    const lowerCaseKeyName = keyName.toLowerCase();
    for (let obj of data) {
        for (let key in obj) {
            if (key.toLowerCase() === lowerCaseKeyName) {
                return obj[key];
            }
        }
    }
    return [];
}

function closeMultiWishlist() {
    closeMultiWishlistDiv.onclick = function () {
        getMultiWishlistDiv.style.display = "none";
        checkedItems = [];
        nonCheckedItems = [];
    };
}

async function executeMe2(wishName, fromWhere) {
    let { accessToken, accessEmail } = getAccessToken();

    let params = (new URL(document.location)).searchParams;
    let sharedId = params.get("id");
    const sharedIdProp = atob(sharedId);

    const userData = await fetch(`${serverURL}/create-new-wihlist`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            wishlistName: [wishName],
            shopName: permanentDomain,
            customerEmail: accessEmail,
            currentToken: accessToken,
            storeName: wf_shopName,
            language: wfGetDomain,
            referral_id: fromWhere === "shared" ? sharedIdProp : ""
        }),
    });
    let result = await userData.json();
}

async function openMultiWishlist(data, productId, fromWhere) {
    closeMultiWishlist();
    getMultiWishlistDiv.style.display = "block";

    const dataToSend = fromWhere === "shared" ? {
        shopName: data.shopName,
        guestToken: data.guestToken,
        customerEmail: data.customerEmail,
    } : "";

    const multiArrayData = await getMultiwishlistData(dataToSend)
    await renderData(multiArrayData, data, productId, fromWhere);
}

// async function renderData(multiArray, data, productId, fromWhere) {
//     const newDataArray = allWishlistData;
//     const isDeleteMode = data.isDelete === "yes";
//     const checkedArr = [];
//     const nonCheckedArr = [];
//     const encodedData = JSON.stringify(data);

//     const wishlistItems = multiArray.map((item, index) => {
//         const arrItem = newDataArray.find((obj) => obj[item]);
//         let isChecked = arrItem
//             ? arrItem[item].some(
//                 (obj) => parseInt(obj.product_id) === parseInt(productId)
//             )
//             : false;

//         if (!isChecked) {
//             isChecked = checkedItems.some(
//                 (value) => value.toLowerCase() === item.toLowerCase()
//             );
//         }

//         (isChecked ? checkedArr : nonCheckedArr).push(item);

//         return `
//             <li>
//                 <label for="item-${index}" class="item-${index}">
//                     <input 
//                         type="checkbox" 
//                         id="item-${index}" 
//                         onclick="${isDeleteMode ? "handleDeleteCheckboxClick" : "handleCheckboxClick"}(event)"
//                         ${isChecked ? "checked" : ""}
//                     >
//                     <p style="margin:0;">${item}</p>
//                 </label>
//             </li>`;
//     }).join("");


//     const wishlists = `
//         <div class="multiCheckbox">
//             <ul id="dataList">
//                 ${wishlistItems}
//             </ul>
//         </div>`;

//     const saveButton = multiArray.length > 0
//         ? `<button class="saveBtn cartButtonStyle" id="${isDeleteMode ? "saveDelWishlistBtn" : "saveWishlistBtn"}"
//               onclick="${isDeleteMode ? "saveDelteWishlists" : "saveWishlists"}(event, ${productId}, '${fromWhere}')">
//               ${isDeleteMode
//             ? customLanguage.editBtn || storeFrontDefLang.editBtn
//             : customLanguage.saveWishlistBtn || storeFrontDefLang.saveWishlistBtn}
//            </button>`
//         : "";

//     const multiWishlistData = `
//         <div>
//             <h3>${isDeleteMode
//             ? customLanguage.editWishlistHeading || storeFrontDefLang.editWishlistHeading
//             : customLanguage.createWishlistHeading || storeFrontDefLang.createWishlistHeading}
//             </h3>
//             <div class="multiWishCreate">
//                 <div class="multiInputDiv">
//                     <input type="text" id="wishlistName" name="wishlistName" placeholder="${storeFrontDefLang.inputPlaceholder}" />
//                 </div>
//                 <div id="hiddenDiv" data-prodata='${encodedData}' data-checkedArr='${JSON.stringify(checkedArr)}' data-nonCheckedArr='${JSON.stringify(nonCheckedArr)}'></div>
//                 <button id="createWishlist" class="cartButtonStyle" type="button" 
//                     onclick="submitWishlistForm(event, ${productId}, '${fromWhere}')">
//                     ${customLanguage.createBtn || storeFrontDefLang.createBtn}
//                 </button>
//             </div>
//             <p id="mainErrorPara"></p>
//             ${wishlists}
//             ${saveButton}
//         </div>`;

//     const container = document.getElementById("wg-multiWishlistInnerContent");
//     if (container) {
//         container.innerHTML = multiWishlistData;
//     }

//     const saveButtonElement = document.getElementById("saveDelWishlistBtn");
//     if (saveButtonElement) {
//         saveButtonElement.disabled = true;
//     }
// }

async function renderData(multiArray, data, productId, fromWhere) {
    const newDataArray = allWishlistData;
    const isDeleteMode = data.isDelete === "yes";
    const checkedArr = [];
    const nonCheckedArr = [];
    const encodedData = JSON.stringify(data).replace("'", "");

    if (isDeleteMode) {
        checkedItems = []
        nonCheckedItems = []
    }

    const wishlistItems = multiArray.map((item, index) => {
        const arrItem = newDataArray.find((obj) => obj[item]);
        let isChecked = arrItem
            ? arrItem[item].some(
                (obj) => parseInt(obj.product_id) === parseInt(productId)
            )
            : false;

        if (!isChecked) {
            isChecked = checkedItems.some(
                (value) => value.toLowerCase() === item.toLowerCase()
            );
        }

        (isChecked ? checkedArr : nonCheckedArr).push(item);

        if (isDeleteMode) {
            (isChecked ? checkedItems : nonCheckedItems).push(item)
        }

        return `
            <li>
                <label for="item-${index}" class="item-${index}">
                    <input 
                        type="checkbox" 
                        id="item-${index}" 
                        onclick="${isDeleteMode ? "handleDeleteCheckboxClick" : "handleCheckboxClick"}(event)"
                        ${isChecked ? "checked" : ""}
                    >
                    <p style="margin:0;">${item}</p>
                </label>
            </li>`;
    }).join("");


    const wishlists = `
        <div class="multiCheckbox">
            <ul id="dataList">
                ${wishlistItems}
            </ul>
        </div>`;

    const saveButton = multiArray.length > 0
        ? `<button class="saveBtn cartButtonStyle" id="${isDeleteMode ? "saveDelWishlistBtn" : "saveWishlistBtn"}"
              onclick="${isDeleteMode ? "saveDelteWishlists" : "saveWishlists"}(event, ${productId}, '${fromWhere}')">
              ${isDeleteMode
            ? customLanguage.editBtn || storeFrontDefLang.editBtn
            : customLanguage.saveWishlistBtn || storeFrontDefLang.saveWishlistBtn}
           </button>`
        : "";

    const multiWishlistData = `
        <div>
            <h3>${isDeleteMode
            ? customLanguage.editWishlistHeading || storeFrontDefLang.editWishlistHeading
            : customLanguage.createWishlistHeading || storeFrontDefLang.createWishlistHeading}
            </h3>
            <div class="multiWishCreate">
                <div class="multiInputDiv">
                    <input type="text" id="wishlistName" name="wishlistName" placeholder="${storeFrontDefLang.inputPlaceholder}" />
                </div>
                <div id="hiddenDiv" data-prodata='${encodedData}' data-checkedArr='${JSON.stringify(checkedArr)}' data-nonCheckedArr='${JSON.stringify(nonCheckedArr)}'></div>
                <button id="createWishlist" class="cartButtonStyle" type="button" 
                    onclick="submitWishlistForm(event, ${productId}, '${fromWhere}')">
                    ${customLanguage.createBtn || storeFrontDefLang.createBtn}
                </button>
            </div>
            <p id="mainErrorPara"></p>
            ${wishlists}
            ${saveButton}
        </div>`;

    const container = document.getElementById("wg-multiWishlistInnerContent");
    if (container) {
        container.innerHTML = multiWishlistData;
    }

    const saveButtonElement = document.getElementById("saveDelWishlistBtn");
    if (saveButtonElement) {
        saveButtonElement.disabled = true;
    }
}

// async function submitWishlistForm(event, productId) {
//     const wishName = event.target.parentNode.querySelector("#wishlistName").value;

//     if (wishName) {
//         if (multiArray.length !== 0) {
//             let matchFound = multiArray.some(
//                 (item) => item.toLowerCase() === wishName.toLowerCase()
//             );

//             if (!matchFound) {
//                 executeMe();
//                 executeMe2(wishName);
//             } else {
//                 const msg = `${wishName} ${storeFrontDefLang.sameWishName}`;
//                 await showErrorPara(msg);
//             }
//         } else {
//             executeMe();
//             executeMe2(wishName);
//         }

//         async function executeMe() {
//             multiArray.splice(0, 0, wishName);
//             let dataValue = event.target.parentNode.querySelector("#hiddenDiv").dataset.prodata;
//             const newData = JSON.parse(dataValue);

//             await renderData(multiArray, newData, productId);
//         }
//     } else {
//         const msg = storeFrontDefLang.emptyInput;
//         await showErrorPara(msg);
//     }
// }

async function submitWishlistForm(event, productId, fromWhere) {
    const wishName = event.target.parentNode.querySelector("#wishlistName").value;

    if (wishName) {
        if (multiArray.length !== 0) {
            let matchFound = multiArray.some(
                (item) => item.toLowerCase() === wishName.toLowerCase()
            );

            if (!matchFound) {
                executeMe();
                executeMe2(wishName, fromWhere);
            } else {
                const msg = `${wishName} ${storeFrontDefLang.sameWishName}`;
                await showErrorPara(msg);
            }
        } else {
            executeMe();
            executeMe2(wishName, fromWhere);
        }

        async function executeMe() {
            multiArray.splice(0, 0, wishName);
            let dataValue = event.target.parentNode.querySelector("#hiddenDiv").dataset.prodata;
            const newData = JSON.parse(dataValue);

            await renderData(multiArray, newData, productId, fromWhere);
        }
    } else {
        const msg = storeFrontDefLang.emptyInput;
        await showErrorPara(msg);
    }
}

function handleCheckboxClick(event) {
    const checkbox = event.target;
    const parent = checkbox.parentElement;
    const pTag = parent.querySelector("p");
    const value = pTag.textContent;

    if (checkbox.checked) {
        checkedItems.push(value);
    } else {
        const index = checkedItems.indexOf(value);
        if (index !== -1) {
            checkedItems.splice(index, 1);
        }
    }
}

// async function handleDeleteCheckboxClick(event) {
//     const checkbox = event.target;
//     const parent = checkbox.parentElement;
//     const value = parent.querySelector("p").textContent;

//     let checkedArr = document.getElementById("hiddenDiv").getAttribute("data-checkedArr");
//     let nonCheckedArr = document.getElementById("hiddenDiv").getAttribute("data-nonCheckedArr");

//     checkedArr = checkedArr ? JSON.parse(checkedArr) : [];
//     nonCheckedArr = nonCheckedArr ? JSON.parse(nonCheckedArr) : [];

//     if (checkbox.checked) {
//         checkedItems.push(value);
//         const index = nonCheckedItems.indexOf(value);
//         if (index !== -1) {
//             nonCheckedItems.splice(index, 1);
//         }
//     } else {
//         nonCheckedItems.push(value);
//         const index = checkedItems.indexOf(value);
//         if (index !== -1) {
//             checkedItems.splice(index, 1);
//         }
//     }

//     const arraysEqual = (arr1, arr2) => arr1.length === arr2.length && arr1.every((element) => arr2.includes(element));
//     const hasOverlap = (arr1, arr2) => arr1.some((element) => arr2.includes(element));

//     const checkedArraysEqual = arraysEqual(checkedArr, checkedItems);
//     const nonCheckedArraysEqual = arraysEqual(nonCheckedArr, nonCheckedItems);
//     const hasSomeElementsOfChecked = hasOverlap(checkedItems, nonCheckedArr);
//     const hasSomeElementsOfNonChecked = hasOverlap(nonCheckedItems, checkedArr);

//     const disableButton =
//         (checkedItems.length === 0 && nonCheckedArr.length === 0) ||
//         (checkedArraysEqual && nonCheckedArr.length === 0) ||
//         (checkedItems.length === 0 && nonCheckedArraysEqual) ||
//         (checkedArraysEqual && nonCheckedArraysEqual) ||
//         (checkedItems.length === 0 && !hasSomeElementsOfNonChecked) ||
//         (!hasSomeElementsOfChecked && nonCheckedItems.length === 0);

//     document.getElementById("saveDelWishlistBtn").disabled = disableButton;
//     console.log(disableButton ? "Button disabled" : "Button enabled");
// }

async function handleDeleteCheckboxClick(event) {
    const checkbox = event.target;
    const parent = checkbox.parentElement;
    const value = parent.querySelector("p").textContent;
    let checkedArr = document.getElementById("hiddenDiv").getAttribute("data-checkedArr");
    let nonCheckedArr = document.getElementById("hiddenDiv").getAttribute("data-nonCheckedArr");

    checkedArr = checkedArr ? JSON.parse(checkedArr) : [];
    nonCheckedArr = nonCheckedArr ? JSON.parse(nonCheckedArr) : [];

    if (checkbox.checked) {
        if (!checkedItems.includes(value)) {
            checkedItems.push(value);
        }
        const index = nonCheckedItems.indexOf(value);
        if (index !== -1) {
            nonCheckedItems.splice(index, 1);
        }
    } else {
        if (!nonCheckedItems.includes(value)) {
            nonCheckedItems.push(value);
        }
        const index = checkedItems.indexOf(value);
        if (index !== -1) {
            checkedItems.splice(index, 1);
        }
    }

    const arraysEqual = (arr1, arr2) => arr1.length === arr2.length && arr1.every((element) => arr2.includes(element));

    const checkedArraysEqual = arraysEqual(checkedArr, checkedItems);
    const nonCheckedArraysEqual = arraysEqual(nonCheckedArr, nonCheckedItems);

    const disableButton =
        (checkedItems.length === 0 && nonCheckedItems.length === 0) ||
        (checkedArraysEqual && nonCheckedArraysEqual)
    document.getElementById("saveDelWishlistBtn").disabled = disableButton;
}

async function saveWishlists(event, productId, fromWhere) {

    if (checkedItems.length === 0) {
        await showErrorPara(storeFrontDefLang.chooseWishlist);
        return;
    }

    const parentElement = event.target.parentNode;
    const dataValue = parentElement.querySelector("#hiddenDiv").dataset.prodata;

    const newData = { ...JSON.parse(dataValue), wishlistName: checkedItems };

    if (newData.shopName) {
        saveSharedWishlist(newData);
    } else {
        saveMainData(newData, productId, fromWhere)
    }

    checkedItems = [];
    nonCheckedItems = [];
    getMultiWishlistDiv.style.display = "none"
}

async function showErrorPara(msg) {
    const mainErrorPara = document.getElementById('wg-multiWishlistInnerContent').querySelector('#mainErrorPara')
    if (mainErrorPara) {
        mainErrorPara.style.display = "block";
        mainErrorPara.innerHTML = msg;
    }
}

async function saveDelteWishlists(event, productId, fromWhere) {
    const parentElement = event.target.parentNode;
    const dataValue = parentElement.querySelector("#hiddenDiv").dataset.prodata;
    const newData = { ...JSON.parse(dataValue), wishlistName: checkedItems, DelWishlistName: nonCheckedItems };

    if (fromWhere === "shared") {
        saveSharedWishlist(newData);
    } else {
        saveMainData(newData, productId, fromWhere)
    }

    checkedItems = [];
    nonCheckedItems = [];
    getMultiWishlistDiv.style.display = "none";
}

async function saveMainData(data, productId, fromWhere) {
    let result = await SqlFunction(data);
    const proId = injectCoderr.getAttribute("data-product-id");

    if (result.msg === "item updated") {
        await showCountAll()
        const matchFound = await checkFound(allWishlistData, productId)

        const notificationMsg = result.isAdded === "yes" && !result.bothUpdated ?
            customLanguage.addToWishlistNotification :
            result.isAdded === "no" && !result.bothUpdated ?
                customLanguage.removeFromWishlistNotification :
                "Wishlist has been updated";

        if (isMultiwishlistTrue) {
            const counterAction = matchFound ? "add" : "remove";
            const updateCounter = async () => {
                if (["block", "inject"].includes(fromWhere)) {
                    await checkCounterData(productId, counterAction);
                } else {
                    await checkCollectionCounterData(productId, counterAction);
                }
            };
            await updateCounter();
        }

        if (fromWhere === "block") {
            isMultiwishlistTrue && (matchFound ? alreadyInWishlist() : addToWishList())
            customIconAddedRemoveToWishlist(productId, matchFound);
            buttonAddedRemoveWishlist(productId, matchFound);
            collectionIcon(productId, matchFound);
            currentPlan > 1 && (matchFound ? fxnAfterAddToWishlist() : fxnAfterRemoveFromWishlist());

        } else if (fromWhere === "inject") {
            isMultiwishlistTrue && injectButtonAddedRemoveWishlist(productId, matchFound)
            customIconAddedRemoveToWishlist(productId, matchFound);
            buttonAddedRemoveWishlist(productId, matchFound);
            collectionIcon(productId, matchFound);
            currentPlan > 1 && (matchFound ? fxnAfterAddToWishlist() : fxnAfterRemoveFromWishlist());

        } else if (fromWhere === "collection") {
            isMultiwishlistTrue && collectionIcon(productId, matchFound)
            injectButtonAddedRemoveWishlist(productId, matchFound);
            if (typeof alreadyInWishlist === 'function' || typeof addToWishList === 'function') {
                if (Number(proId) === Number(productId)) {
                    matchFound ? alreadyInWishlist() : addToWishList();
                }
            }
            buttonAddedRemoveWishlist(productId, matchFound)
            customIconAddedRemoveToWishlist(productId, matchFound);
            currentPlan > 1 && (matchFound ? fxnAfterAddToWishlist() : fxnAfterRemoveFromWishlist());

        } else if (fromWhere === "cutomButton") {
            isMultiwishlistTrue && buttonAddedRemoveWishlist(productId, matchFound)
            injectButtonAddedRemoveWishlist(productId, matchFound);
            if (typeof alreadyInWishlist === 'function' || typeof addToWishList === 'function') {
                if (Number(proId) === Number(productId)) {
                    matchFound ? alreadyInWishlist() : addToWishList();
                }
            }
            customIconAddedRemoveToWishlist(productId, matchFound);
            collectionIcon(productId, matchFound);
            currentPlan > 1 && (matchFound ? fxnAfterAddToWishlist() : fxnAfterRemoveFromWishlist());

        } else {
            isMultiwishlistTrue && customIconAddedRemoveToWishlist(productId, matchFound)
            injectButtonAddedRemoveWishlist(productId, matchFound);
            if (typeof alreadyInWishlist === 'function' || typeof addToWishList === 'function') {
                if (Number(proId) === Number(productId)) {
                    matchFound ? alreadyInWishlist() : addToWishList();
                }
            }
            buttonAddedRemoveWishlist(productId, matchFound);
            collectionIcon(productId, matchFound);
            currentPlan > 1 && (matchFound ? fxnAfterAddToWishlist() : fxnAfterRemoveFromWishlist());
        }
        matchFound ? alertToast(notificationMsg, "added") : alertToast(customLanguage.removeFromWishlistNotification, "removed");
        (currentPlan >= 3 && generalSetting?.trendingLayout) && await renderTrendingGridData();

    }

    if (result.msg === "limit cross") {
        alertContent(customLanguage?.quotaLimitAlert || storeFrontDefLang.quotaLimitAlert);
    }
}

function getWishlistByKey(arrayData, key) {
    const wishlist = arrayData.find((obj) => obj[key]);
    return wishlist ? [wishlist] : [];
}

async function deleteWishlist(event, key) {
    event.stopPropagation();
    closeMultiWishlist();
    getMultiWishlistDiv.style.display = "block";

    let productsToDelete = [];

    const matchingData = allWishlistData.find(item => item[key]);
    if (matchingData[key].length > 0) {
        matchingData[key].forEach(product => {
            productsToDelete.push({ ...product });
        });
    }

    const encodedData = JSON.stringify(productsToDelete)

    let editData = `<div class="deleteMultiWishlist">
                        <h3>${customLanguage.deleteMsg || storeFrontDefLang.deleteMsg}</h3>
                        <div class="deleteWishDiv">
                            <button id="deleteYes" class="cartButtonStyle" type="button" onclick="yesDelete('${key}')">${customLanguage.deleteYesBtn || storeFrontDefLang.deleteYesBtn}</button>
                            <button id="deleteNo" class="cartButtonStyle" type="button" onclick="noDelete()">${customLanguage.deleteNoBtn || storeFrontDefLang.deleteNoBtn}</button>
                        </div>
                    </div>`;

    document.getElementById("wg-multiWishlistInnerContent").innerHTML = editData;
    document.getElementById("deleteYes").setAttribute("data-allItems", encodedData);
}

async function yesDelete(key) {
    const getCurrentLogin = await getCurrentLoginFxn();
    const userData = await fetch(`${serverURL}/delete-wishlist-name`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            keyName: key,
            shopName: permanentDomain,
            customerEmail: getCurrentLogin,
            shopDomain: shopDomain,
            currentToken: localStorage.getItem("access-token"),
            plan: currentPlan,
            storeName: wf_shopName
        }),
    });

    const allData = document.getElementById("deleteYes").getAttribute('data-allItems')
    const parsedData = JSON.parse(allData);

    let result = await userData.json();
    if (result.msg === "wishlist deleted successfuly") {
        getMultiWishlistDiv.style.display = "none";
        renderLoader();
        await showCountAll();
        drawerButtonDiv();
        modalButtonFxn();

        createFilterOptionInStructure();

        const arrayList = isMultiwishlistTrue
            ? allWishlistData
            : getWishlistByKey(allWishlistData, "favourites");

        const renderFn = generalSetting.wishlistDisplay === "drawer"
            ? () => renderDrawerContentFxn()
            : () => renderMultiModalContentFxn(arrayList);

        await renderFn();

        if (parsedData.length > 0) {
            const mainWishlistDiv = document.getElementById("wishlist-guru");
            const proId = injectCoderr.getAttribute("data-product-id")
            const isProId = proId && /^\d+$/.test(proId)

            let matchFound = false;
            if (isProId && currentPlan >= 2) {
                matchFound = await checkFound(allWishlistData, proId)
                await checkCounterData(proId, !matchFound && "remove");
                proId && injectButtonAddedRemoveWishlist(proId, matchFound)
            }

            if (mainWishlistDiv) {
                matchFound ? alreadyInWishlist() : addToWishList()
            }

            parsedData.forEach(async (ele) => {
                const matchFound2 = await checkFound(allWishlistData, ele.product_id);

                if (currentPlan >= 2 && !matchFound2) {
                    await checkCollectionCounterData(ele.product_id, "remove");
                    collectionIcon(ele.product_id, matchFound2)
                    customIconAddedRemoveToWishlist(ele.product_id, matchFound2)
                    buttonAddedRemoveWishlist(ele.product_id, matchFound2)
                }
            });
            (currentPlan >= 3 && generalSetting?.trendingLayout) && await renderTrendingGridData();
        }
    }
}

async function noDelete() {
    getMultiWishlistDiv.style.display = "none";
}

async function editWishlistName(event, key) {
    event.stopPropagation();
    closeMultiWishlist();

    const nearestEditWishDiv = event.target.closest(".wf-multi-Wish-content").querySelector(".editWishDiv");
    const nearestH3 = event.target.closest(".wf-multi-Wish-content").querySelector("h3");
    const nearestEditWishIconDiv = event.target.closest(".edit-main-icon");

    nearestEditWishDiv && (nearestEditWishDiv.style.display = "flex");
    nearestEditWishIconDiv && (nearestEditWishIconDiv.style.display = "none");
    nearestH3 && (nearestH3.style.display = "none");
}

async function saveEditWishlistName(event, key) {
    const newWishName = event.target.closest(".editWishDivInner").querySelector(".editInput").value;
    const errorPara = event.target.closest(".editWishDiv").querySelector(".errorPara");
    const getCurrentLogin = await getCurrentLoginFxn();

    if (!newWishName) {
        errorPara.style.display = "block";
        errorPara.innerHTML = `${storeFrontDefLang.emptyInput}`;
        return;
    }

    if (multiArray.some((item) => item.toLowerCase() === newWishName.toLowerCase())) {
        errorPara.style.display = "block";
        errorPara.innerHTML = `${newWishName} ${storeFrontDefLang.sameWishName}`;
        return;
    }

    const nearestEditWishDiv = event.target.closest(".wf-multi-Wish-content").querySelector(".editWishDiv");
    const nearestH3 = event.target.closest(".wf-multi-Wish-content").querySelector("h3");
    const nearestEditWishIconDiv = event.target.closest(".wf-multi-Wish-content").querySelector(".edit-main-icon")
    const nearestH3Content = event.target.closest(".wf-multi-Wish-content").querySelector("h3");

    nearestEditWishDiv && (nearestEditWishDiv.style.display = "none");
    nearestEditWishIconDiv && (nearestEditWishIconDiv.style.display = "flex");
    nearestH3 && (nearestH3.style.display = "block");
    nearestH3Content && (nearestH3.textContent = newWishName);
    errorPara.style.display = "none";

    try {
        const response = await fetch(`${serverURL}/edit-wishlist-name`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                oldWishlistName: key,
                newWishlistName: newWishName,
                shopName: permanentDomain,
                customerEmail: getCurrentLogin,
                shopDomain,
                currentToken: localStorage.getItem("access-token"),
            }),
        });

        const result = await response.json();
        showCountAll()
    } catch (error) {
        console.error("Error updating wishlist name:", error);
    }
}

function closeEditWishlistName(event, key) {
    const nearestEditWishDiv = event.target.closest(".wf-multi-Wish-content").querySelector(".editWishDiv");
    const nearestEditWishIconDiv = event.target.closest(".wf-multi-Wish-content").querySelector(".edit-main-icon");
    const nearestH3 = event.target.closest(".wf-multi-Wish-content").querySelector("h3");
    const errorPara = event.target.closest(".editWishDiv").querySelector(".errorPara");

    errorPara.style.display = "none";
    errorPara.innerHTML = ``;

    nearestEditWishDiv && (nearestEditWishDiv.style.display = "none");
    nearestEditWishIconDiv && (nearestEditWishIconDiv.style.display = "flex");
    nearestH3 && (nearestH3.style.display = "block");
}

async function copyItem(
    product_id,
    variant_id,
    handle,
    price,
    image,
    title,
    quantity,
    key
) {
    closeMultiWishlist();
    getMultiWishlistDiv.style.display = "block";
    let wishlists = "";

    const newMultiArray = allWishlistData.filter(entry => {
        const keyValue = Object.keys(entry)[0];
        return keyValue.toLowerCase() !== key.toLowerCase() && !entry[keyValue].some(item => Number(item.product_id) === Number(product_id));
    }).map(entry => Object.keys(entry)[0]);



    if (allWishlistData.length === 1) {
        wishlists += `<div class="wg-cant-copy">${storeFrontDefLang?.onlyOneWishlist || "Currently you have only one wishlist, make another one to copy wishlist."}</div>`
    } else {


        if (newMultiArray.length === 0) {
            wishlists += `<div class="wg-cant-copy">${storeFrontDefLang.cantCopy}</div>`
        } else {
            wishlists += `<div class="multiCheckbox"><ul id="dataList">`;
            newMultiArray.map((item, index) =>
                wishlists += `<li><label for="item-${index}" class="item-${index}">
                            <input type="checkbox" onclick="handleCheckboxClick(event, ${index})" id="item-${index}">
                            <p style="margin:0;">${item}</p>
                            </label>
                        </li>`
            )
            wishlists += `</ul></div>`;
        }


    }

    const editData = `
        <h3>${customLanguage.copyHeading || storeFrontDefLang.copyHeading}</h3>
        ${wishlists}
        ${newMultiArray.length !== 0
            ? `<p id="mainErrorPara">Please enter name*</p>
              <button id="copyBtn" class="cartButtonStyle" onclick="copyCheckedItem(${product_id}, ${variant_id}, '${handle}', '${price}', '${image}', '${title}', '${quantity}')">
                ${customLanguage.copyBtn || storeFrontDefLang.copyBtn}
              </button>`
            : ""
        }`;

    document.getElementById("wg-multiWishlistInnerContent").innerHTML = editData;
}

async function copyCheckedItem(
    product_id,
    variant_id,
    handle,
    price,
    image,
    title,
    quantity
) {
    const getCurrentLogin = await getCurrentLoginFxn();

    if (checkedItems.length === 0) {
        return showErrorPara(storeFrontDefLang.chooseWishlist)
    }

    try {
        const response = await fetch(`${serverURL}/copy-to-wishlist`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                shopName: permanentDomain,
                customerEmail: getCurrentLogin,
                shopDomain: shopDomain,
                currentToken: localStorage.getItem("access-token"),
                productId: product_id,
                variantId: variant_id,
                price: price,
                handle: handle,
                title: title,
                image: image,
                quantity: quantity,
                wishlistName: checkedItems,
            }),
        });

        const result = await response.json();

        if (result.msg === "item updated" && result.isAdded === "yes") {
            getMultiWishlistDiv.style.display = "none";
            renderLoader();
            await showCountAll();

            createFilterOptionInStructure();

            const arrayList = isMultiwishlistTrue
                ? allWishlistData
                : getWishlistByKey(allWishlistData, "favourites");

            const renderFn = generalSetting.wishlistDisplay === "drawer"
                ? () => renderDrawerContentFxn()
                : () => renderMultiModalContentFxn(arrayList);

            await renderFn();
        }
    } catch (err) {
        console.error("Error copying item to wishlist:", err);
    }
}

function renderLoader() {
    let loaderr = document.querySelectorAll(".show-title");
    for (let i = 0; i < loaderr.length; i++) {
        loaderr[i].innerHTML = `<div class="loader-css" ><span> </span></div>`;
    }
    document.querySelector(".drawer-main").innerHTML = `<div class="loader-css" ><span></span></div>`;
}

async function clearAllWishlist() {
    const defaultWishlist = allWishlistData.find(item => item.favourites && item.favourites.length > 0);
    const wishlistId = defaultWishlist ? defaultWishlist.favourites[0].wishlist_id : null;
    let productIds = []
    if (!isMultiwishlistTrue) {
        productIds = defaultWishlist.favourites.map(item => item.product_id);
    }

    isMultiwishlistTrue
        ? await renderClearWishlistNames()
        : await clearDefaultWishlist([wishlistId], productIds)
}

async function renderClearWishlistNames() {
    closeMultiWishlist();
    getMultiWishlistDiv.style.display = "block";
    let wishlists = "";

    wishlists += `<div class="multiCheckbox"><ul id="dataList">`;
    multiArray.forEach((item, index) => {
        wishlists += `<li>
                    <label for="item-${index}" class="item-${index}">
                        <input type="checkbox" onclick="handleCheckboxClick(event)" id="item-${index}">
                        <p style="margin:0;">${item}</p>
                    </label>
                  </li>`;
    });
    wishlists += `</ul></div>`;

    const clearButton = `<button class="saveBtn cartButtonStyle" onclick="clearAllYesBtn(event)">${customLanguage.clearWishlistBtn || storeFrontDefLang.clearWishlistBtn}</button>`;

    const multiWishlistData = `<div>
            <h3>${customLanguage.clearWishlist || storeFrontDefLang.clearWishlist}</h3>
            ${wishlists}
            ${clearButton}
            <p id="mainErrorPara"></p>
        </div>`;

    document.getElementById("wg-multiWishlistInnerContent").innerHTML = multiWishlistData;
}

async function clearAllYesBtn(event) {
    const errorPara = event.target.closest("#wg-multiWishlistInnerContent").querySelector("#mainErrorPara");

    const arrayList = isMultiwishlistTrue
        ? allWishlistData
        : await getWishlistByKey("favourites");

    let wishlistIds = [];
    let productIds = []

    if (checkedItems.length > 0) {
        checkedItems.forEach((key) => {
            arrayList.forEach((obj) => {
                if (obj[key]) {
                    obj[key].forEach((item) => {
                        if (!wishlistIds.includes(item.wishlist_id)) {
                            wishlistIds.push(item.wishlist_id);
                        }
                        if (!productIds.includes(item.product_id)) {
                            productIds.push(item.product_id);
                        }
                    });
                }
            });
        });
    } else {
        errorPara.style.display = "block";
        errorPara.innerHTML = `${storeFrontDefLang.chooseDelWish}`;
        return;
    }

    await clearDefaultWishlist(wishlistIds, productIds)
}

async function clearDefaultWishlist(idArray, proIdArray) {
    const getCurrentLogin = await getCurrentLoginFxn();
    try {
        const response = await fetch(`${serverURL}/delete-all-items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                wishlistIds: idArray,
                shopName: permanentDomain,
                customerEmail: getCurrentLogin,
                plan: currentPlan,
                storeName: wf_shopName
            }),
        });
        let result = await response.json();

        if (result === "All items removed") {
            getMultiWishlistDiv.style.display = "none";
            renderLoader();
            await showCountAll();
            drawerButtonDiv();
            modalButtonFxn();

            createFilterOptionInStructure();

            const arrayList = isMultiwishlistTrue
                ? allWishlistData
                : getWishlistByKey(allWishlistData, "favourites");

            const renderFn = generalSetting.wishlistDisplay === "drawer"
                ? () => renderDrawerContentFxn()
                : () => renderMultiModalContentFxn(arrayList);

            await renderFn();

            if (proIdArray.length > 0) {
                const mainWishlistDiv = document.getElementById("wishlist-guru");
                const proId = injectCoderr.getAttribute("data-product-id")
                const isProId = proId && /^\d+$/.test(proId)

                let matchFound = false;
                if (isProId && currentPlan >= 2) {
                    matchFound = await checkFound(allWishlistData, proId)
                    await checkCounterData(proId, !matchFound && "remove");
                    proId && injectButtonAddedRemoveWishlist(proId, matchFound)
                }

                if (mainWishlistDiv) {
                    matchFound ? alreadyInWishlist() : addToWishList()
                }

                proIdArray.forEach(async (id) => {
                    const matchFound2 = await checkFound(allWishlistData, id);

                    if (currentPlan >= 2 && !matchFound2) {
                        await checkCollectionCounterData(id, "remove");
                        collectionIcon(id, matchFound2)
                        customIconAddedRemoveToWishlist(id, matchFound2);

                        // -------------for la girls site-----------
                        customIconAddedRemoveToWishlistLaGirl(id, matchFound2);

                        buttonAddedRemoveWishlist(id, matchFound2);
                    }
                });
                (currentPlan >= 3 && generalSetting?.trendingLayout) && await renderTrendingGridData();
            }
        }
    } catch (error) {
        console.log("err", error)
    }
}

async function checkFound(wishlistData, selectedId) {
    const found = isMultiwishlistTrue
        ? await isIdExist(wishlistData, parseInt(selectedId))
        : await isIdExistInKey(wishlistData, "favourites", parseInt(selectedId));
    return found;
}

async function checkCounterData(productId, checkAddOrRemove) {
    const checkCountData = customButton.showCount === "increaseNdecrease" ? "true" : "false"
    if (customButton.showCount !== "no" && currentPlan >= 2) {
        await createLikeFromSql(productId, checkCountData, checkAddOrRemove)
    }
}

async function checkCollectionCounterData(productId, checkAddOrRemoveCol) {
    const checkCountColData = collectionBtnSetting?.collectionShowCount === "increaseNdecrease" ? "true" : "false"
    if (collectionBtnSetting?.collectionShowCount !== "no") {
        await createLikeFromSql(productId, checkCountColData, checkAddOrRemoveCol)
    }
}

function updateCountElement(element, countData) {
    if (element) {
        const parser = new DOMParser();
        const parsedDocument = parser.parseFromString(countData, "text/html");
        const countValue = parseInt(parsedDocument.querySelector(".wf-product-count")?.textContent, 10) || 0;
        element.textContent = countValue;
    }
};

function renderPopupLoader() {
    getMultiWishlistDiv.style.display = "block";
    document.getElementById('wg-multiWishlistInnerContent').innerHTML = `<div class="loader-css" ><span> </span></div>`
}


async function disableShare(data, className) {
    try {


        const totalObjects = await getCount(data);

        function updateClass() {
            document.querySelectorAll(className).forEach(div => {
                if (totalObjects === 0) {
                    div.classList.add("wg-disabled");
                } else {
                    div.classList.remove("wg-disabled");
                }
            });
        }

        updateClass();

        const observer = new MutationObserver(() => {
            updateClass();
        });

        observer.observe(document.body, { childList: true, subtree: true });


    } catch (error) {
        console.log("Error in disableShare:", error);
    }
}