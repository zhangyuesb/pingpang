export const jwtUtil = {
    /**
     * 解析 JWT Token
     * @param {string} token - JWT 字符串
     * @returns {Object|null} - 解析后的 JSON 对象（Payload 部分）
     */
    parseJwt(token) {
        try {
            if (!token) throw new Error("Token 不能为空");

            // 1. 拆分 JWT：Header.Payload.Signature
            const parts = token.split('.');
            if (parts.length !== 3) throw new Error("无效的 JWT 格式");

            // 2. Base64 解码 Payload
            const payload = atob(parts[1]);

            // 3. JSON 解析
            return JSON.parse(payload);
        } catch (error) {
            console.error("JWT 解析失败:", error);
            return null;
        }
    },

    /**
     * 检查 Token 是否过期
     * @param {string} token - JWT 字符串
     * @returns {boolean} - true 代表过期，false 代表未过期
     */
    isTokenExpired(token) {
        const decoded = this.parseJwt(token);
        if (!decoded || !decoded.exp) return true; // 解析失败或者没有 exp 字段，直接视为过期

        const currentTime = Math.floor(Date.now() / 1000); // 获取当前时间（秒）
        return decoded.exp < currentTime; // 过期返回 true
    }
};