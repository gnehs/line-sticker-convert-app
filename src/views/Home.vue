<template>
	<div>
		<div
			class="lc-container"
			@dragenter.stop.prevent="dragging = true"
			@dragover.prevent.stop="dragging = true"
		>
			<div
				class="drag-warpper"
				:class="{active:dragging}"
				@dragleave.stop.prevent="dragging = false"
				@drop.prevent.stop="onDrop"
			>
				<div class="content">
					<eva-icon name="file-outline" fill="white" width="100px" height="100px"></eva-icon>
					<h3 class="my-3">放下檔案來新增</h3>
					<p>拖移檔案至此來新增檔案</p>
				</div>
			</div>
			<div class="text-center" v-if="files.length==0">
				<br />
				<br />
				<img
					src="../assets/logo.png"
					style="filter: drop-shadow(0 4px 15px rgba(0,0,0,.05));"
					width="200px"
				/>
				<br />
				<br />
				<h3>尚未載入任何檔案</h3>
				<p>拖移檔案至此來新增檔案</p>
			</div>
			<div class="my-3 p-3" v-else>
				<!--<h6 class="border-bottom border-gray pb-2 mb-0">待轉換檔案</h6>-->

				<div class="media text-muted pt-3" v-for="(file,i) in files" :key="file.uuid" :alt="file.path">
					<div
						class="media-body pb-3 mb-0 small lh-125 border-gray"
						:class="{'border-bottom':i!=files.length-1}"
					>
						<div class="d-flex justify-content-between align-items-center w-100">
							<div>
								<strong class="text-gray-dark">{{file.name}}</strong>
								<span class="d-block">{{file.parsedSize}}</span>
							</div>
							<button type="button" class="btn btn-primary" @click="removeFile(file.uuid)">刪除</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<nav class="navbar fixed-bottom navbar-expand-sm navbar-dark bg-dark">
			<a class="navbar-brand" href="#">Line 貼圖轉換器</a>
			<div class="collapse navbar-collapse">
				<ul class="navbar-nav mr-auto">
					<li class="nav-item active">
						<a class="nav-link" href="#">{{files.length}} 個檔案</a>
					</li>
				</ul>
				<div class="form-inline my-2 my-lg-0">
					<button class="btn btn-success my-2 my-sm-0">下一步</button>
				</div>
			</div>
		</nav>
	</div>
</template>
<style scoped>
	.lc-container {
		padding: 5px;
		height: 100vh;
		width: 100vw;
	}
</style>
<style lang="sass" scoped>
.drag-warpper
	position: fixed
	color: #FFF
	background-color: #000000a6
	width: 100vw
	height: 100vh
	z-index: 2000
	display: flex
	backdrop-filter: blur(3px)
	margin: -5px
	transition: all .3s ease
	&:not(.active)
		opacity: 0
		pointer-events: none
	.content
		text-align: center
		align-self: center
		width: 100vw
</style>
<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
	name: 'Home',
	components: {
		//HelloWorld
	},
	data: () => ({
		files: [], dragging: false
	}),
	methods: {
		onDrop(e) {
			this.dragging = false
			function _uuid() {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8; return v.toString(16); });
			}
			function humanFileSize(bytes, si = true) {
				var thresh = si ? 1000 : 1024;
				if (Math.abs(bytes) < thresh) {
					return bytes + ' B';
				}
				var units = si
					? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
					: ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
				var u = -1;
				do {
					bytes /= thresh;
					++u;
				} while (Math.abs(bytes) >= thresh && u < units.length - 1);
				return bytes.toFixed(1) + ' ' + units[u];
			}
			for (let f of e.dataTransfer.files) {
				console.log(f)
				f.uuid = _uuid()
				f.parsedSize = humanFileSize(f.size)
				if (!this.files.filter(x => x.path == f.path).length > 0) {
					this.files.push(f)
				}
				else {
					this.$toasted.show(`${f.name} 已存在`, {
						theme: "toasted-primary",
						position: "top-center",
						duration: 2000
					});
				}

			}
		},
		removeFile(uuid) {
			this.files = this.files.filter(x => x.uuid != uuid)
		}
	}
}
</script>
