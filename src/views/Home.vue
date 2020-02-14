<template>
	<div>
		<div
			class="lc-container"
			@dragenter.stop.prevent="dragging = true"
			@dragover.prevent.stop="dragging = true"
			v-if="step=='import'"
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
					style="filter: drop-shadow(0 4px 15px rgba(0,0,0,.1));"
					width="200px"
				/>
				<br />
				<br />
				<h3>尚未載入任何檔案</h3>
				<p>拖移檔案至此來新增檔案</p>
			</div>
			<div class="my-3 p-3" v-else>
				<h1 class="display-4">檔案清單</h1>
				<!--<h6 class="border-bottom border-gray pb-2 mb-0">待轉換檔案</h6>-->

				<div class="media text-muted pt-3" v-for="(file,i) in files" :key="file.uuid" :alt="file.path">
					<div class="file-icon mr-2" :data-type="file.extension"></div>
					<div
						class="media-body pb-3 mb-0 small lh-125 border-gray"
						:class="{'border-bottom':i!=files.length-1}"
					>
						<div class="d-flex justify-content-between align-items-center w-100">
							<div>
								<strong class="text-gray-dark">{{file.name}}</strong>
								<span class="d-block">{{file.parsedSize}}</span>
							</div>
							<button type="button" class="btn btn-danger" @click="removeFile(file.uuid)">
								<eva-icon fill="white" name="close-outline"></eva-icon>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="lc-container" v-if="step=='options'">
			<div class="my-3 p-3">
				<h1 class="display-4">選擇存檔方式</h1>
				<div
					class="card mb-3"
					@click="saveType='source'"
					:class="{'text-white bg-primary':saveType=='source'}"
				>
					<div class="card-body">
						<h5 class="card-title">與來源檔案相同的資料夾</h5>
						<p class="card-text">
							為了避免檔案覆蓋問題，轉換後的檔案將會有
							<kbd>_line</kbd> 後綴。
						</p>
					</div>
				</div>
				<div
					class="card mb-3"
					@click="pickDirectory"
					:class="{'text-white bg-primary':saveType=='folder'}"
				>
					<div class="card-body">
						<h5 class="card-title">指定資料夾</h5>
						<p class="card-text">轉換後的檔案將存放於指定的資料夾內。</p>
					</div>
					<div class="card-footer" v-show="saveType=='folder'">
						<small class="text-white">{{saveFolder}}</small>
					</div>
				</div>
			</div>
		</div>
		<div class="lc-container" v-if="step=='convert'">
			<div class="my-3 p-3">
				<h1 class="display-4">正在轉換</h1>
				<div class="media text-muted pt-3" v-for="(file,i) in files" :key="file.uuid" :alt="file.path">
					<div class="file-icon mr-2" :data-type="file.extension"></div>
					<div
						class="media-body pb-3 mb-0 small lh-125 border-gray"
						:class="{'border-bottom':i!=files.length-1}"
					>
						<div class="d-flex justify-content-between align-items-center w-100">
							<div>
								<strong class="text-gray-dark">{{file.name}}</strong>
								<span class="d-block">{{file.parsedSize}}</span>
							</div>
							<div v-if="!file.done">轉換中...</div>
							<div v-if="file.done">完成</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<nav class="navbar fixed-bottom navbar-expand-sm navbar-dark bg-primary">
			<a class="navbar-brand" href="#">Line 貼圖轉換器</a>
			<div class="collapse navbar-collapse">
				<ul class="navbar-nav mr-auto">
					<li class="nav-item active" v-if="step=='import'&&files.length>0">
						<a class="nav-link" href="#">{{files.length}} 個檔案</a>
					</li>
				</ul>
				<div class="form-inline my-lg-0" v-if="step=='import'">
					<button
						type="button"
						class="btn btn-outline-light"
						@click="step='options'"
						:disabled="files.length==0"
					>下一步</button>
				</div>
				<div class="form-inline my-lg-0" v-if="step=='options'">
					<div class="btn-group">
						<button type="button" class="btn btn-outline-light" @click="step='import'">上一步</button>

						<button type="button" class="btn btn-outline-light" @click="startConvert">開始轉換</button>
					</div>
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
const { dialog, app } = require('electron').remote;
const { execFile } = require('child_process');
const path = require('path');
export default {
	name: 'Home',
	components: {
		//HelloWorld
	},
	data: () => ({
		files: [],
		step: "import",
		//step: import
		dragging: false,
		//step: options
		saveType: 'source',
		saveFolder: null
	}),
	methods: {
		//step: import
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
				f.extension = f.name.split('.').pop();
				f.uuid = _uuid()
				f.parsedSize = humanFileSize(f.size)
				if (f.type.startsWith("image/")) {
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
				} else {
					this.$toasted.show(`不支援該格式：${f.name}`, {
						theme: "toasted-primary",
						position: "top-center",
						duration: 2000
					});
				}

			}
		},
		removeFile(uuid) {
			this.files = this.files.filter(x => x.uuid != uuid)
		},

		//step: options
		async pickDirectory() {
			let folder = await dialog.showOpenDialog({
				properties: ['openDirectory']
			});
			if (folder.filePaths[0]) {
				this.saveType = 'folder'
				this.saveFolder = folder.filePaths[0]
			}
		},
		//step: convert
		startConvert() {
			this.step = 'convert'
			for (let file of this.files) {
				let filePath, outputFilePath, tempFilePath
				filePath = file.path
				tempFilePath = path.join(app.getPath("temp"), Math.random().toString(36).substring(7))
				if (this.saveType == 'source') {
					outputFilePath = path.join(path.dirname(file.path), path.basename(file.path, path.extname(file.path)) + '_line.png')
				}
				else {
					outputFilePath = path.join(path.dirname(this.saveFolder), path.basename(file.path, path.extname(file.path)) + '.png')
				}
				execFile('node', ['./src/assets/parseFile.js', filePath, outputFilePath, tempFilePath], (error, stdout, stderr) => {
					if (error) {
						throw error;
					}
					console.log(stdout);
					stdout = JSON.parse(stdout)
					this.fileDone(file.uuid)
					this.$toasted.show(`✅ 轉換完畢 ${path.extname(file.path)} (${stdout.metadata.width}x${stdout.metadata.height})`, {
						theme: "toasted-primary",
						position: "top-center",
						duration: 2000
					});
				})
			}
		},
		fileDone(uuid) {
			this.files = this.files.map(x => {
				if (x.uuid == uuid) x.done = true
				return x
			})
		}
	}
}
</script>
