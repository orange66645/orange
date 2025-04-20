<template>
	<div class="login-container">
		<el-card class="login-card">
			<el-tabs v-model="activeTab">
				<el-tab-pane label="登录" name="login">
					<el-form :model="loginForm" @submit.prevent="handleLogin">
						<el-form-item>
							<el-input v-model="loginForm.username" placeholder="用户名" />
						</el-form-item>
						<el-form-item>
							<el-input v-model="loginForm.password" type="password" placeholder="密码" />
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="handleLogin" style="width: 100%">登录</el-button>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				
				<el-tab-pane label="注册" name="register">
					<el-form :model="registerForm" @submit.prevent="handleRegister">
						<el-form-item>
							<el-input v-model="registerForm.username" placeholder="用户名" />
						</el-form-item>
						<el-form-item>
							<el-input v-model="registerForm.password" type="password" placeholder="密码" />
						</el-form-item>
						<el-form-item>
							<el-input v-model="registerForm.confirmPassword" type="password" placeholder="确认密码" />
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="handleRegister" style="width: 100%">注册</el-button>
						</el-form-item>
					</el-form>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login, register } from '@/api/user'  

const router = useRouter()
const activeTab = ref('login')

const loginForm = reactive({
	username: '',
	password: ''
})

const registerForm = reactive({
	username: '',
	password: '',
	confirmPassword: ''
})

const handleLogin = async () => {
	try {
		if (!loginForm.username || !loginForm.password) {
			ElMessage.warning('请填写完整信息')
			return
		}

		const res = await login(loginForm)
		localStorage.setItem('token', res.data.token)
		localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
		// 根据角色类型跳转到不同页面
          if (res.data.userInfo.roleType === 2) {
            router.push('/admin')
            ElMessage.success('管理员登录成功')
          } else {
            router.push('/')
            ElMessage.success('登录成功')
          }
	} catch (error) {
		console.error('登录失败:', error)
	}
}

const handleRegister = async () => {
	try {
		if (!registerForm.username || !registerForm.password || !registerForm.confirmPassword) {
			ElMessage.warning('请填写完整信息')
			return
		}

		if (registerForm.password !== registerForm.confirmPassword) {
			ElMessage.error('两次输入的密码不一致')
			return
		}

		await register({
			username: registerForm.username,
			password: registerForm.password
		})
		
		ElMessage.success('注册成功')
		activeTab.value = 'login'
		registerForm.username = ''
		registerForm.password = ''
		registerForm.confirmPassword = ''
	} catch (error) {
		console.error('注册失败:', error)
	}
}
</script>

<style scoped>
.login-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: #f5f5f5;
}

.login-card {
	width: 400px;
}

.el-form-item {
	margin-bottom: 20px;
}
</style>