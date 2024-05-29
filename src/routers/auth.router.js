import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/auth/sign-up', async (req, res, next) => {
	// 1. **요청 정보**
	//     - **이메일, 비밀번호, 비밀번호 확인, 이름**을 **Request Body**(**`req.body`**)로 전달 받습니다.
	const { email, password, passwordConfirm, name } = req.body;


	// 2. **유효성 검증 및 에러 처리**
	//     - **회원 정보 중 하나라도 빠진 경우** - “OOO을 입력해 주세요.”
	//     - **이메일 형식에 맞지 않는 경우** - “이메일 형식이 올바르지 않습니다.”

	//     - **이메일이 중복되는 경우** - “이미 가입 된 사용자입니다.”
	const isExistEmail = await prisma.users.findFirst({
		where: {
			email
		}
	});
	if (isExistEmail) {
		return res.status(400).json({ message: '이미 가입된 사용자입니다.' });
	}

	//     - **비밀번호가 6자리 미만인 경우** - “비밀번호는 6자리 이상이어야 합니다.”
	if (password.length < 6) {
		return res.status(400).json({ message: '비밀번호는 6자리 이상이어야 합니다.' });
	}

	//     - **비밀번호와 비밀번호 확인이 일치하지 않는 경우** - “입력 한 두 비밀번호가 일치하지 않습니다.”
	if (password !== passwordConfirm) {
		return res.status(400).json({ message: '입력 한 두 비밀번호가 일치하지 않습니다.' });
	}
	// 3. **비즈니스 로직(데이터 처리)**
	const hashedPassword = await bcrypt.hash(password, 10);

	const user = await prisma.users.create({
		data: {
			email,
			password: hashedPassword,
		}
	});

	const userInfo = await prisma.userInfos.create({
		data: {
			UserId: user.userId,
			name,
			role,
		}
	})

	//     - **사용자 ID, 역할, 생성일시, 수정일시**는 ****자동 생성됩니다.
	//     - **역할**의 종류는 다음과 같으며, 기본 값은 **`APPLICANT`** 입니다.
	//         - 지원자 **`APPLICANT`**
	//         - 채용 담당자 **`RECRUITER`**
	//     - 보안을 위해 **비밀번호**는 평문(Plain Text)으로 저장하지 않고 **Hash 된 값**을 저장합니다.

	// 4. **반환 정보**
	//     - **사용자 ID, 이메일, 이름, 역할, 생성일시, 수정일시**를 반환합니다.


});

export default router;