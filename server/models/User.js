module.exports = (sequelize, DataTypes) => {
  const USER = sequelize.define(
    'user',
    {
      email: {
        type: DataTypes.STRING(100),
        unique: true,
      },
      code: {
        type: DataTypes.STRING(20),
      },
      password: {
        type: DataTypes.STRING(100),
      },
      rol: {
        type: DataTypes.STRING(20),
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      provider: {
        type: DataTypes.STRING(20),
      },
      snsId: {
        type: DataTypes.STRING(100),
      },
      recommender: {
        type: DataTypes.STRING(20),
      },
      image: {
        type: DataTypes.STRING(20),
      },
      lastLogin_at: {
        type: DataTypes.STRING(100),
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci', // 한글 저장
    }
  );

  return USER;
};
