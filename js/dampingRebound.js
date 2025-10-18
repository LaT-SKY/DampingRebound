export function bindDampingRebound(element, targetX, targetY, options = {}){
	const config = {
		stiffness: 300,
		damping: 25,
		mass: 1,
		precision: 0.1,
		...options
	};

	if (element._dampingAnimationId){
		cancelAnimationFrame(element._dampingAnimationId);
	}
	
	const currentTransform = parseElementTransform(element);
	let currentX = currentTransform.x;
	let currentY = currentTransform.y;
	let velocityX = 0;
	let velocityY = 0;
	
	element._dampingStartTime = null;
	
	const animate = (timestamp) => {
		if (!element._dampingStartTime){
			element._dampingStartTime = timestamp;
		}
		
		const deltaTime = Math.min(timestamp - element._dampingStartTime, 4) / 1000;
		element._dampingStartTime = timestamp;
		
		const distanceX = targetX - currentX;
		const distanceY = targetY - currentY;
		
		const accelerationX = (config.stiffness * distanceX - config.damping * velocityX) / config.mass;
		const accelerationY = (config.stiffness * distanceY - config.damping * velocityY) / config.mass;
		
		velocityX += accelerationX * deltaTime;
		velocityY += accelerationY * deltaTime;
	
		currentX += velocityX * deltaTime;
		currentY += velocityY * deltaTime;
		
		element.style.transform = `translate(${currentX}px, ${currentY}px)`;
		
		const totalDistance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
		const totalSpeed = Math.sqrt(velocityX ** 2 + velocityY ** 2);
		
		if (totalDistance > config.precision || totalSpeed > config.precision){
			element._dampingAnimationId = requestAnimationFrame(animate);
		} else {
			element.style.transform = `translate(${targetX}px, ${targetY}px)`;
			element._dampingAnimationId = null;
		}
	};
	
	element._dampingAnimationId = requestAnimationFrame(animate);
	
	return {
		stop: ()=>{
			if (element._dampingAnimationId){
				cancelAnimationFrame(element._dampingAnimationId);
				element._dampingAnimationId = null;
			}
		},
		updateTarget: (newX, newY)=>{
			targetX = newX;
			targetY = newY;
		}
	};
}

function parseElementTransform(element){
	const style = window.getComputedStyle(element);
	const transform = style.transform;
	
	if (transform === 'none'){
		return {x : 0, y : 0};
	}
	
	const translateMatch = transform.match(/translate\(([^)]+)\)/);
	if (translateMatch){
		const values = translateMatch[1].split(',').map(val =>
			parseFloat(val.trim().replace('px', ''))
		);
		return { x: values[0] || 0, y: values[1] || 0 };
	}
	
	const matrixMatch = transform.match(/matrix\(([^)]+)\)/);
	if (matrixMatch){
		const values = matrixMatch[1].split(',').map(parseFloat)
		return { x : values[4] || 0, y : values[5] || 0};
	}
	
	return { x : 0, y : 0 };
}