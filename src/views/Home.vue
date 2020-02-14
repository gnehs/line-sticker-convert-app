<template>
	<div class="home">
		<img
			alt="logo"
			src="../assets/logo.png"
			style="filter: drop-shadow(0 4px 15px rgba(0,0,0,.15));"
			width="200px"
		/>
		<HelloWorld msg="Welcome to Your Vue.js App" />
	</div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
	name: 'Home',
	components: {
		HelloWorld
	}
}
</script>
