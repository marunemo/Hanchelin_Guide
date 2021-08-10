package com.hanchelin_guide;

import com.facebook.react.ReactActivity;

import android.os.Bundle; // react-navigation

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Hanchelin_Guide";
  }

  /**
   * In react-navigation, react-native-screens package requires this life cycle method.
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }
}
