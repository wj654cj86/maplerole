# 角色卡表圖片編輯器

* 進入編輯器
	1. [正體中文](https://wj654cj86.github.io/maplerole/)
	2. [简体中文](https://wj654cj86.github.io/maplerole/?lang=zh-Hans)
	3. [English](https://wj654cj86.github.io/maplerole/?lang=en)

* 拍聯盟戰地照片：在楓之谷中拍下聯盟戰地的所有角色，注意的點是不要移動到聯盟戰地的視窗，因為編輯器只能抓固定的座標，如果移動到就會偏移。

* 載入圖片
	1. 選擇檔案可以多選
	2. 然後修改「每行角色數量」
	3. 最後按下載入

* 遮住或傷害或名稱
	1. 按下遮住全部傷害會把所有傷害遮住
	2. 按下遮住全部名稱會把所有名稱遮住

* 刪除或新增一行
	1. 刪除一行會刪除最後一行，需要將最後一行的角色卡清空，否則無法刪除。
	2. 新增一行會在最後面新增一行。

* 角色卡上面的圖示功能
	1. 職業圖示：可以用滑鼠左鍵點擊切換，因為有些角色名稱會蓋到角色卡上的職業圖示，所以編輯器會偵測職業圖示重新覆蓋上完整圖示。但是編輯器偵測職業圖示時有機率偵測錯誤，只要點擊角色卡上方的職業圖示可以修正。
		1. ![劍士圖示](https://wj654cj86.github.io/maplerole/img/icon/warrior.png) 劍士
		2. ![法師圖示](https://wj654cj86.github.io/maplerole/img/icon/magician.png) 法師
		3. ![弓箭手圖示](https://wj654cj86.github.io/maplerole/img/icon/bowman.png) 弓箭手
		4. ![盜賊圖示](https://wj654cj86.github.io/maplerole/img/icon/thief.png) 盜賊
		5. ![海盜圖示](https://wj654cj86.github.io/maplerole/img/icon/pirate.png) 海盜
		6. ![傑諾圖示](https://wj654cj86.github.io/maplerole/img/icon/xenon.png) 傑諾
		7. ![Lab圖示](https://wj654cj86.github.io/maplerole/img/icon/lab.png) Lab：當要使用遮住傷害時，Lab方塊不會遮住傷害。
		8. ![楓之谷M圖示](https://wj654cj86.github.io/maplerole/img/icon/mobile.png) 楓之谷M
		9. ![無圖示](https://wj654cj86.github.io/maplerole/img/icon/card.png) 無圖示：需要用滑鼠右鍵來切換。
	2. ![下載圖示](https://wj654cj86.github.io/maplerole/img/download.png) 下載：下載單張角色卡。
	3. ![刪除圖示](https://wj654cj86.github.io/maplerole/img/cross.png) 刪除：可以刪除掉不要顯示的角色。
	4. ![遮住傷害圖示](https://wj654cj86.github.io/maplerole/img/maskdamage.png)![顯示傷害圖示](https://wj654cj86.github.io/maplerole/img/showdamage.png) 傷害顯示：可以選擇單張角色卡是否顯示戰地傷害。
	5. ![遮住名稱圖示](https://wj654cj86.github.io/maplerole/img/maskname.png)![顯示名稱圖示](https://wj654cj86.github.io/maplerole/img/showname.png) 名稱顯示：可以選擇單張角色卡是否顯示遊戲匿名。

* 向前排列：將角色卡往前遞補空卡位

* 刪除無效角色卡：因為聯盟戰地角色卡列表是四個角色為一個單位，所以尾端會有空白角色卡，載入時避免誤判所以程式不會刪除，由使用者確認再刪除。

* Lab卡排列：有些玩家有Lab卡片，依據喜好可以排到最前面或最後面。

* 下載圖片：下載所有角色卡集成一張圖片。
	1. 下載為png
	2. 下載為jpg，有jpg品質，主要是調整檔案大小使用，太低圖片會很糊。

* 移動方式
	1. 序列移動：因為有些使用者想要按等級排序，圖片載入後有可能是按順序載入，如果用交換移動會破壞順序。
	2. 交換移動：當移動角色卡時會和移動到位置的卡片交換位置。
