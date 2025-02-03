material-ui-6.x + vite + taiwind

### ENV

package.json

```json
"type": "module",
```

vite.config.js

```js
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // 設置主機為 '0.0.0.0' 以便在局域網中可訪問
    port: 5000, // 更改端口為 5000
  },
});
```

npm install 版本 tailwindcss postcss autoprefixer

```json
  "dependencies": {
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.1",
  },
  "devDependencies": {
    "tailwindcss": "^3.4.17",
  }
```

tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

postcss.config.js

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 流程

### 註冊流程

firebase 用戶註冊邏輯
先建立一個 Provider 提供呼叫 firestore 和驗證的 auth
const auth = getAuth(app);
const firestore = getFirestore(app);

再建立一個 AuthContext.Provider 裡面提供儲存 當下用戶資訊 & 角色

然後再寫登入邏輯測試 登入邏輯

useContext 用法
建立一個
const Context = React.createContext(null);
<AuthContext.Provider props={value}>
{other components}
</AuthContext.Provider>

被包裹的 components 可以 import AuthContext from xxxxx.jsx
const { value } = useContext(AuthContext); 就可以取出共用值

但是為了使用方便會變成在添加
export const useAuth = () => {
return useContext(AuthContext);
};

以後只要 import useAuth , const {value} = useAuth() 就可以取值

### NavBar

tailwind rwd , login

- xl , l , ....
  hamburger menu & alert window
- 3 button control same alert window
