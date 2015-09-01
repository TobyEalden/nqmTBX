
appPalette = {
  primary1Color: mui.Styles.Colors.blueGrey400,
  primary2Color: mui.Styles.Colors.blueGrey700,
  primary3Color: mui.Styles.Colors.blueGrey300,
  //accent1Color: mui.Styles.Colors.amber500,
  //accent2Color: mui.Styles.Colors.blueGrey500,
  //accent3Color: mui.Styles.Colors.blueGrey500

  textColor: "#eee"

// rest of the palette is set from Theme Manager
};

componentThemes = {
  toolbar: {
    backgroundColor: appPalette.primary1Color
  },
  paper: {
    backgroundColor: appPalette.primary3Color
  }
};

ThemeManager = new mui.Styles.ThemeManager();
//ThemeManager.setPalette(appPalette);
//ThemeManager.setComponentThemes(componentThemes);
//ThemeManager.setTheme(ThemeManager.types.DARK);

