import { bindDampingRebound } from "./js/dampingRebound.js";

// 获取元素
const box = document.querySelector("#box");
const stiffnessSlider = document.getElementById('stiffness');
const dampingSlider = document.getElementById('damping');
const massSlider = document.getElementById('mass');
const precisionSlider = document.getElementById('precision');
const stiffnessInput = document.getElementById('stiffness-input');
const dampingInput = document.getElementById('damping-input');
const massInput = document.getElementById('mass-input');
const precisionInput = document.getElementById('precision-input');
const stiffnessValue = document.getElementById('stiffness-value');
const dampingValue = document.getElementById('damping-value');
const massValue = document.getElementById('mass-value');
const precisionValue = document.getElementById('precision-value');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

// 默认配置
let config = {
	stiffness: 300,
	damping: 25,
	mass: 1,
	precision: 0.1
};

// 阻尼回弹实例
let dampingInstance = null;

// 初始化阻尼回弹
function initDampingRebound() {
	if (dampingInstance) {
		dampingInstance.stop();
	}
	
	dampingInstance = bindDampingRebound(box, 1000, 100, config);
}

// 更新滑块值显示
function updateSliderValues() {
	stiffnessValue.textContent = stiffnessSlider.value;
	dampingValue.textContent = dampingSlider.value;
	massValue.textContent = massSlider.value;
	precisionValue.textContent = precisionSlider.value;
}

// 更新配置
function updateConfig() {
	config = {
		stiffness: parseFloat(stiffnessSlider.value),
		damping: parseFloat(dampingSlider.value),
		mass: parseFloat(massSlider.value),
		precision: parseFloat(precisionSlider.value)
	};
}

// 滑块事件监听
stiffnessSlider.addEventListener('input', function() {
	stiffnessValue.textContent = this.value;
	stiffnessInput.value = this.value;
});

dampingSlider.addEventListener('input', function() {
	dampingValue.textContent = this.value;
	dampingInput.value = this.value;
});

massSlider.addEventListener('input', function() {
	massValue.textContent = this.value;
	massInput.value = this.value;
});

precisionSlider.addEventListener('input', function() {
	precisionValue.textContent = this.value;
	precisionInput.value = this.value;
});

// 数字输入框事件监听
stiffnessInput.addEventListener('input', function() {
	let value = parseFloat(this.value) || 0;
	value = Math.max(value, 1);
	value = Math.min(value, 1000);
	this.value = value;
	stiffnessSlider.value = value;
	stiffnessValue.textContent = value;
});

dampingInput.addEventListener('input', function() {
	let value = parseFloat(this.value) || 0;
	value = Math.max(value, 1);
	value = Math.min(value, 100);
	this.value = value;
	dampingSlider.value = value;
	dampingValue.textContent = value;
});

massInput.addEventListener('input', function() {
	let value = parseFloat(this.value) || 0;
	value = Math.max(value, 0.1);
	value = Math.min(value, 10);
	this.value = value;
	massSlider.value = value;
	massValue.textContent = value;
});

precisionInput.addEventListener('input', function() {
	let value = parseFloat(this.value) || 0;
	value = Math.max(value, 0.01);
	value = Math.min(value, 1);
	this.value = value;
	precisionSlider.value = value;
	precisionValue.textContent = value;
});

// 失去焦点时同步到配置
stiffnessInput.addEventListener('blur', function() {
	updateConfig();
});

dampingInput.addEventListener('blur', function() {
	updateConfig();
});

massInput.addEventListener('blur', function() {
	updateConfig();
});

precisionInput.addEventListener('blur', function() {
	updateConfig();
});

// 开始按钮事件 - 只有点击开始时box才会运动
startBtn.addEventListener('click', function() {
	updateConfig();
	initDampingRebound();
});

// 重置按钮事件 - 只重置box位置，不触发运动
resetBtn.addEventListener('click', function() {
	// 停止当前动画
	if (dampingInstance) {
		dampingInstance.stop();
		dampingInstance = null;
	}
	
	// 重置box位置
	box.style.transform = 'translate(0px, 0px)';
});

// 初始化显示
updateSliderValues();