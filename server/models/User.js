module.exports = (sequelize, DataTypes) => {
  const USER = sequelize.define(
    'user',
    {
      state: {
        type: DataTypes.STRING(20),
      }, // 계정 상태
      email: {
        type: DataTypes.STRING(100),
        unique: true,
      }, // 이메일
      code: {
        type: DataTypes.STRING(20),
      }, // email 가입코드
      password: {
        type: DataTypes.STRING(100),
      }, // 비밀번호
      rol: {
        type: DataTypes.STRING(20),
      }, // 계정 권한
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      }, // 회원명
      provider: {
        type: DataTypes.STRING(20),
      }, // sns종류
      snsId: {
        type: DataTypes.STRING(100),
      }, // sns아이디
      // recommender: {
      //   type: DataTypes.STRING(20),
      // }, // 추천인
      image: {
        type: DataTypes.STRING(20),
      }, // 프로필 사진 주소
      lastLogin_at: {
        type: DataTypes.STRING(100),
      }, // 마지막 로그인
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci', // 한글 저장
    }
  );

  return USER;
};
