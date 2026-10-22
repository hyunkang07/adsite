/* ========================================
   글자수 계산
======================================== */

const textInput = document.querySelector("#text-input");
const totalCount = document.querySelector("#total-count");
const withSpaceCount = document.querySelector("#with-space-count");
const withoutSpaceCount = document.querySelector("#without-space-count");
const wordCount = document.querySelector("#word-count");
const actionMessage = document.querySelector("#action-message");
const resetButton = document.querySelector("#reset-button");
const copyButton = document.querySelector("#copy-button");

const segmenter = typeof Intl.Segmenter === "function"
    ? new Intl.Segmenter("ko", { granularity: "grapheme" })
    : null;

function countCharacters(text) {
    if (segmenter) {
        return Array.from(segmenter.segment(text)).length;
    }

    return Array.from(text).length;
}

// 글자수와 단어 수를 실시간으로 계산합니다.
function updateCounts() {
    const text = textInput.value;
    const textWithoutSpaces = text.replace(/\s/gu, "");
    const words = text.trim().split(/\s+/u).filter(Boolean);

    totalCount.value = countCharacters(text);
    withSpaceCount.value = countCharacters(text);
    withoutSpaceCount.value = countCharacters(textWithoutSpaces);
    wordCount.value = words.length;
}

// 입력 내용을 지우고 통계를 초기화합니다.
function resetText() {
    textInput.value = "";
    actionMessage.textContent = "입력 내용을 지웠습니다.";
    updateCounts();
    textInput.focus();
}

// 클립보드 API를 우선 사용하고, 지원되지 않는 환경에서는 대체 복사를 시도합니다.
async function copyText() {
    const text = textInput.value;

    if (!text) {
        actionMessage.textContent = "복사할 텍스트가 없습니다.";
        return;
    }

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            const temporaryInput = document.createElement("textarea");
            temporaryInput.value = text;
            temporaryInput.setAttribute("readonly", "");
            temporaryInput.style.position = "fixed";
            temporaryInput.style.opacity = "0";
            document.body.append(temporaryInput);
            temporaryInput.select();
            const copied = document.execCommand("copy");
            temporaryInput.remove();

            if (!copied) {
                throw new Error("Copy command failed");
            }
        }

        actionMessage.textContent = "텍스트를 클립보드에 복사했습니다.";
    } catch {
        actionMessage.textContent = "복사에 실패했습니다. 텍스트를 직접 선택해 복사해 주세요.";
    }
}

textInput.addEventListener("input", () => {
    actionMessage.textContent = "";
    updateCounts();
});

resetButton.addEventListener("click", resetText);
copyButton.addEventListener("click", copyText);

updateCounts();