
appPalette = {
  primary1Color: mui.Styles.Colors.blueGrey500,
  primary2Color: mui.Styles.Colors.grey400,
  primary3Color: mui.Styles.Colors.blueGrey300,
  accent1Color: mui.Styles.Colors.blueGrey200,
  accent2Color: mui.Styles.Colors.pink800,
  accent3Color: mui.Styles.Colors.orangeA400,
  textColor: mui.Styles.Colors.grey900,
  canvasColor: mui.Styles.Colors.grey200,
  borderColor: mui.Styles.Colors.grey300,

  nqmTBXListBackground: mui.Styles.Colors.white,
  nqmTBXListTextColor: mui.Styles.Colors.grey700,
  nqmTBXListIconColor: mui.Styles.Colors.grey600
//  disabledColor: mui.Styles.ColorManipulator.fade(mui.Styles.Colors.darkBlack, 0.3)
};

componentThemes = {
  toolbar: {
    backgroundColor: appPalette.primary1Color
  },
  paper: {
    backgroundColor: appPalette.canvasColor
  },
  raisedButton: {
    textColor: appPalette.primary3Color,
    color: mui.Styles.Colors.blueGrey400,
    primaryColor: mui.Styles.Colors.amber800,
    secondaryColor: mui.Styles.Colors.orange300
  },
  textField: {
    hintColor: mui.Styles.Colors.grey500
  },
  listItem: {
    nestedLevelDepth: 12
  }
};

ThemeManager = new mui.Styles.ThemeManager();
ThemeManager.setPalette(appPalette);
ThemeManager.setComponentThemes(componentThemes);
// appPalette = ThemeManager.palette;
// ThemeManager.setTheme(ThemeManager.types.DARK);

