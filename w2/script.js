// 確保 HTML DOM 載入完成才執行程式碼，避免 null 錯誤
document.addEventListener('DOMContentLoaded', () => {
    // 預設餐廳清單（包含精選美食照片）
    const defaultRestaurants = [
        {
            name: "小樂精緻麵食館",
            img: "https://i.postimg.cc/CKfj41y2/小樂.png",
            tag: "小樂精緻麵食館"
        },
        {
            name: "尚鴻自助餐",
            img: "https://i.postimg.cc/bwSG7B6r/尚鴻自助餐.jpg",
            tag: "樹德科大第二宿舍棟 MoFan食代廣場"
        },
        {
            name: "The T",
            img: "https://i.postimg.cc/g2J6k0NB/The-t.jpg",
            tag: "THE T café 樹德科大店 / TKS FULL HOUSE series"
        },
        {
            name: "深水食堂",
            img: "https://i.postimg.cc/fbxVL0Qy/深水食堂.png",
            tag: "深水食堂"
        },
        {
            name: "7-11",
            img: "https://i.postimg.cc/4dLp1hL5/7-11.png",
            tag: "7-ELEVEN 樹科門市"
        }
    ];

    // 自訂輸入項目的備用圖片庫
    const defaultFoodImages = [
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
    ];

    let restaurants = [...defaultRestaurants];
    let isDrawing = false;

    // 取得 DOM 元素
    const titleText = document.getElementById('titleText');
    const slotDisplay = document.getElementById('slotDisplay');
    const slotText = document.getElementById('slotText');
    const drawBtn = document.getElementById('drawBtn');
    const mapBtn = document.getElementById('mapBtn');
    const foodImage = document.getElementById('foodImage');
    const categoryTag = document.getElementById('categoryTag');
    const tagCloud = document.getElementById('tagCloud');
    const newOptionInput = document.getElementById('newOptionInput');
    const addBtn = document.getElementById('addBtn');

    // 渲染餐廳標籤清單
    function renderChips() {
        tagCloud.innerHTML = '';
        restaurants.forEach((item, index) => {
            const chip = document.createElement('div');
            chip.className = 'restaurant-chip';
            chip.innerHTML = `
                <span>${item.name}</span>
                <i class="fa-solid fa-xmark remove-icon" data-index="${index}"></i>
            `;
            tagCloud.appendChild(chip);
        });

        // 綁定刪除按鈕事件
        document.querySelectorAll('.remove-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                if (restaurants.length <= 1) {
                    alert('至少需要保留一個選項喔！');
                    return;
                }
                restaurants.splice(idx, 1);
                renderChips();
            });
        });
    }

    // 新增自訂餐廳
    function addNewOption() {
        const text = newOptionInput.value.trim();
        if (!text) return;

        const randomImg = defaultFoodImages[Math.floor(Math.random() * defaultFoodImages.length)];
        restaurants.push({
            name: text,
            img: randomImg,
            tag: "私房推薦"
        });

        newOptionInput.value = '';
        renderChips();
    }

    addBtn.addEventListener('click', addNewOption);
    newOptionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addNewOption();
    });

    // 點擊「點我抽籤」觸發快速跑馬燈與彈跳動畫
    drawBtn.addEventListener('click', () => {
        if (isDrawing) return;
        if (restaurants.length === 0) {
            alert('請先新增至少一個餐廳選項！');
            return;
        }

        isDrawing = true;
        drawBtn.disabled = true;
        drawBtn.style.opacity = '0.7';

        // 重設標題動畫
        titleText.classList.remove('bounce-anim');
        titleText.textContent = "美味選擇中...";

        // 抽籤中暫停地圖按鈕
        mapBtn.classList.add('disabled');
        mapBtn.href = "#";

        // 快速跑馬燈滾動效果
        let counter = 0;
        const totalSpins = 25; 
        const speed = 70; 

        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * restaurants.length);
            const currentOption = restaurants[randomIndex];
            
            slotText.textContent = currentOption.name;
            foodImage.src = currentOption.img;

            counter++;
            if (counter >= totalSpins) {
                clearInterval(interval);
                finishDraw();
            }
        }, speed);
    });

    // 抽籤揭曉結果
    function finishDraw() {
        const finalChoice = restaurants[Math.floor(Math.random() * restaurants.length)];

        // 更新大標題與生動彈跳動畫
        titleText.textContent = finalChoice.name;
        titleText.classList.add('bounce-anim');

        // 更新卡槽與圖片
        slotText.textContent = `🎉 恭喜抽中：${finalChoice.name}`;
        foodImage.src = finalChoice.img;
        categoryTag.textContent = finalChoice.tag || "隨機推薦";

        // 設定 Google Map 開啟連結
        const query = encodeURIComponent(finalChoice.name);
        mapBtn.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
        mapBtn.classList.remove('disabled');

        // 觸發慶祝彩帶特效
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#f97316', '#f59e0b', '#3b82f6', '#ffffff']
            });
        }

        // 恢復按鈕狀態
        isDrawing = false;
        drawBtn.disabled = false;
        drawBtn.style.opacity = '1';
    }

    // 初始化渲染標籤
    renderChips();
});
