(() => {
  "use strict";

  // =========================================================
  // API
  // =========================================================
  const API_BASE = "http://127.0.0.1:8000";

  // =========================================================
  // HTML ELEMENTS
  // =========================================================
  const form = document.getElementById("predict-form");
  const submitBtn = document.getElementById("submit-btn");
  const resetBtn = document.getElementById("reset-btn");
  const errorRetryBtn = document.getElementById("error-retry-btn");

  const stateIdle = document.getElementById("state-idle");
  const stateLoading = document.getElementById("state-loading");
  const stateResult = document.getElementById("state-result");
  const stateError = document.getElementById("state-error");

  const scoreNumberEl = document.getElementById("score-number");
  const scoreBandEl = document.getElementById("score-band");
  const scoreContextEl = document.getElementById("score-context");
  const gaugeFill = document.getElementById("gauge-fill");

  const errorLabelEl = document.getElementById("error-label");
  const errorCopyEl = document.getElementById("error-copy");

  const segGroup = document.getElementById("stress_level_group");
  const stressHiddenInput = document.getElementById("stress_level");

  const GAUGE_ARC_LENGTH = 314;

  // =========================================================
  // BASIC CHECK
  // =========================================================
  if (!form) {
    console.error("ERROR: #predict-form was not found.");
    return;
  }

  // =========================================================
  // DRAW GAUGE TICKS
  // =========================================================
  function drawTicks() {
    document.querySelectorAll(".gauge-ticks").forEach((g) => {
      g.innerHTML = "";

      const cx = 120;
      const cy = 140;
      const rOuter = 100;
      const rInner = 90;

      for (let i = 0; i <= 10; i += 2) {
        const angle = Math.PI - (i / 10) * Math.PI;

        const x1 = cx + rOuter * Math.cos(angle);
        const y1 = cy - rOuter * Math.sin(angle);

        const x2 = cx + rInner * Math.cos(angle);
        const y2 = cy - rInner * Math.sin(angle);

        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );

        line.setAttribute("x1", x1.toFixed(1));
        line.setAttribute("y1", y1.toFixed(1));
        line.setAttribute("x2", x2.toFixed(1));
        line.setAttribute("y2", y2.toFixed(1));

        g.appendChild(line);
      }
    });
  }

  // =========================================================
  // ERROR HELPERS
  // =========================================================
  function fieldWrapper(input) {
    return input ? input.closest(".field") : null;
  }

  function setFieldError(input, message) {
    const wrap = fieldWrapper(input);

    if (!wrap) return;

    wrap.classList.add("field-error");

    const msgEl = wrap.querySelector(".error-msg");

    if (msgEl) {
      msgEl.textContent = message;
    }
  }

  function clearFieldError(input) {
    const wrap = fieldWrapper(input);

    if (!wrap) return;

    wrap.classList.remove("field-error");

    const msgEl = wrap.querySelector(".error-msg");

    if (msgEl) {
      msgEl.textContent = "";
    }
  }

  function clearAllErrors() {
    form.querySelectorAll(".field").forEach((field) => {
      field.classList.remove("field-error");
    });

    form.querySelectorAll(".error-msg").forEach((msg) => {
      msg.textContent = "";
    });
  }

  // =========================================================
  // UI STATES
  // =========================================================
  function showState(name) {
    const states = {
      idle: stateIdle,
      loading: stateLoading,
      result: stateResult,
      error: stateError
    };

    // Hide EVERY state first.
    Object.values(states).forEach((element) => {
      if (element) {
        element.hidden = true;
        element.style.display = "none";
      }
    });

    // Show ONLY requested state.
    const activeState = states[name];

    if (activeState) {
      activeState.hidden = false;
      activeState.style.display = "flex";
    }
  }

  // =========================================================
  // INITIAL UI
  // =========================================================
  drawTicks();

  // Only idle screen is visible when page first loads.
  showState("idle");

  // =========================================================
  // STRESS LEVEL BUTTONS
  // =========================================================
  if (segGroup && stressHiddenInput) {
    const stressButtons = segGroup.querySelectorAll(".seg-btn");

    stressButtons.forEach((button) => {
      button.addEventListener("click", () => {

        // Remove active state from every button.
        stressButtons.forEach((b) => {
          b.classList.remove("active");
        });

        // Activate selected button.
        button.classList.add("active");

        // Store selected value.
        stressHiddenInput.value =
          button.dataset.value || "";

        console.log(
          "Selected stress level:",
          stressHiddenInput.value
        );

        clearFieldError(stressHiddenInput);
      });
    });
  }

  // =========================================================
  // COLLECT FORM DATA
  // =========================================================
  function collectPayload() {
    const fd = new FormData(form);

    function numberValue(name, parser) {
      const value = fd.get(name);

      if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
      ) {
        return NaN;
      }

      return parser(value);
    }

    return {
      age: numberValue(
        "age",
        (v) => parseInt(v, 10)
      ),

      gender:
        fd.get("gender") || "",

      country:
        String(fd.get("country") || "").trim(),

      academic_level:
        fd.get("academic_level") || "",

      most_used_platform:
        fd.get("most_used_platform") || "",

      purpose_of_use:
        fd.get("purpose_of_use") || "",

      avg_daily_usage_hours:
        numberValue(
          "avg_daily_usage_hours",
          (v) => parseFloat(v)
        ),

      daily_unlocks:
        numberValue(
          "daily_unlocks",
          (v) => parseInt(v, 10)
        ),

      study_hours:
        numberValue(
          "study_hours",
          (v) => parseFloat(v)
        ),

      physical_activity_hours:
        numberValue(
          "physical_activity_hours",
          (v) => parseFloat(v)
        ),

      sleep_hours_per_night:
        numberValue(
          "sleep_hours_per_night",
          (v) => parseFloat(v)
        ),

      stress_level:
        fd.get("stress_level") || ""
    };
  }

  // =========================================================
  // VALIDATION
  // =========================================================
  function validate(payload) {
    const errors = [];

    const numericChecks = [
      ["age", 10, 100],
      ["avg_daily_usage_hours", 0, 24],
      ["daily_unlocks", 0, Infinity],
      ["study_hours", 0, 24],
      ["physical_activity_hours", 0, 24],
      ["sleep_hours_per_night", 0, 24]
    ];

    numericChecks.forEach(([key, min, max]) => {
      const input =
        document.getElementById(key);

      const value =
        payload[key];

      if (
        value === null ||
        value === undefined ||
        Number.isNaN(value) ||
        !Number.isFinite(value)
      ) {
        errors.push([
          input,
          "This field is required."
        ]);
      } else if (
        value < min ||
        value > max
      ) {
        errors.push([
          input,
          `Must be between ${min} and ${
            max === Infinity ? "0+" : max
          }.`
        ]);
      }
    });

    const requiredFields = [
      "gender",
      "country",
      "academic_level",
      "most_used_platform",
      "purpose_of_use"
    ];

    requiredFields.forEach((key) => {
      const input =
        document.getElementById(key);

      if (
        !payload[key] ||
        String(payload[key]).trim() === ""
      ) {
        errors.push([
          input,
          "This field is required."
        ]);
      }
    });

    // Stress level is required.
    if (!payload.stress_level) {
      errors.push([
        stressHiddenInput,
        "Please select a stress level."
      ]);
    }

    return errors;
  }

  // =========================================================
  // CONVERT FRONTEND DATA TO FASTAPI FORMAT
  // =========================================================
  function makeApiPayload(payload) {
    return {
      Age:
        payload.age,

      Gender:
        payload.gender,

      Country:
        payload.country,

      Academic_Level:
        payload.academic_level,

      Most_Used_Platform:
        payload.most_used_platform,

      Purpose_Of_Use:
        payload.purpose_of_use,

      Avg_Daily_Usage_Hours:
        payload.avg_daily_usage_hours,

      Daily_Unlocks:
        payload.daily_unlocks,

      Study_Hours:
        payload.study_hours,

      Physical_Activity_Hours:
        payload.physical_activity_hours,

      Sleep_Hours_Per_Night:
        payload.sleep_hours_per_night,

      Stress_Level:
        payload.stress_level
    };
  }

  // =========================================================
  // SUBMIT BUTTON
  // =========================================================
  function setSubmitting(value) {
    if (!submitBtn) return;

    submitBtn.disabled = value;

    submitBtn.classList.toggle(
      "loading",
      value
    );
  }

  // =========================================================
  // SCORE BAND
  // =========================================================
  function bandFor(score) {

    if (score < 4) {
      return {
        label: "Signal: strained",
        context:
          "Your responses suggest elevated strain right now. Small shifts in sleep or screen time can go a long way."
      };
    }

    if (score < 7) {
      return {
        label: "Signal: balanced",
        context:
          "Your rhythm looks fairly steady, with some room to recover and reset."
      };
    }

    return {
      label: "Signal: strong",
      context:
        "Your habits point to a well-supported, resilient baseline. Keep it up."
    };
  }

  // =========================================================
  // DISPLAY RESULT
  // =========================================================
  function renderResult(score) {
    const numericScore =
      Number(score);

    console.log(
      "FINAL PREDICTION:",
      numericScore
    );

    if (
      !Number.isFinite(numericScore)
    ) {
      renderError(
        "Invalid prediction",
        "The server returned an invalid prediction score."
      );

      return;
    }

    // Keep score between 0 and 10.
    const clampedScore =
      Math.max(
        0,
        Math.min(
          10,
          numericScore
        )
      );

    const result =
      bandFor(clampedScore);

    // Display score.
    if (scoreNumberEl) {
      scoreNumberEl.textContent =
        clampedScore.toFixed(2);
    }

    // Display signal.
    if (scoreBandEl) {
      scoreBandEl.textContent =
        result.label;
    }

    // Display explanation.
    if (scoreContextEl) {
      scoreContextEl.textContent =
        result.context;
    }

    // Animate gauge.
    if (gaugeFill) {

      gaugeFill.style.transition =
        "none";

      gaugeFill.style.strokeDashoffset =
        String(GAUGE_ARC_LENGTH);

      requestAnimationFrame(() => {

        gaugeFill.style.transition = "";

        const offset =
          GAUGE_ARC_LENGTH *
          (
            1 -
            clampedScore / 10
          );

        gaugeFill.style.strokeDashoffset =
          String(offset);
      });
    }

    // Show ONLY result.
    showState("result");
  }

  // =========================================================
  // DISPLAY ERROR
  // =========================================================
  function renderError(
    label,
    message
  ) {
    console.error(
      "PREDICTION ERROR:",
      label,
      message
    );

    if (errorLabelEl) {
      errorLabelEl.textContent =
        label;
    }

    if (errorCopyEl) {
      errorCopyEl.textContent =
        message;
    }

    // Show ONLY error.
    showState("error");
  }

  // =========================================================
  // HANDLE FASTAPI 422 VALIDATION ERRORS
  // =========================================================
  function applyServerValidationErrors(
    detail
  ) {
    if (!Array.isArray(detail)) {
      return false;
    }

    let matched = false;

    const fieldMap = {
      Age:
        "age",

      Gender:
        "gender",

      Country:
        "country",

      Academic_Level:
        "academic_level",

      Most_Used_Platform:
        "most_used_platform",

      Purpose_Of_Use:
        "purpose_of_use",

      Avg_Daily_Usage_Hours:
        "avg_daily_usage_hours",

      Daily_Unlocks:
        "daily_unlocks",

      Study_Hours:
        "study_hours",

      Physical_Activity_Hours:
        "physical_activity_hours",

      Sleep_Hours_Per_Night:
        "sleep_hours_per_night",

      Stress_Level:
        "stress_level"
    };

    detail.forEach((error) => {

      const apiField =
        Array.isArray(error.loc)
          ? error.loc[
              error.loc.length - 1
            ]
          : null;

      const htmlId =
        fieldMap[apiField] ||
        apiField;

      const input =
        htmlId === "stress_level"
          ? stressHiddenInput
          : document.getElementById(
              htmlId
            );

      if (input) {

        setFieldError(
          input,
          error.msg ||
            "Invalid value."
        );

        matched = true;
      }
    });

    return matched;
  }

  // =========================================================
  // FORM SUBMIT
  // =========================================================
  form.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      clearAllErrors();

      // ---------------------------------------------
      // Collect form values
      // ---------------------------------------------
      const payload =
        collectPayload();

      console.log(
        "FRONTEND PAYLOAD:",
        payload
      );

      // ---------------------------------------------
      // Validate
      // ---------------------------------------------
      const validationErrors =
        validate(payload);

      if (
        validationErrors.length > 0
      ) {

        validationErrors.forEach(
          ([input, message]) => {

            if (input) {
              setFieldError(
                input,
                message
              );
            }
          }
        );

        if (
          validationErrors[0] &&
          validationErrors[0][0]
        ) {
          validationErrors[0][0].focus();
        }

        return;
      }

      // ---------------------------------------------
      // Loading state
      // ---------------------------------------------
      setSubmitting(true);

      showState("loading");

      // ---------------------------------------------
      // Convert data for FastAPI
      // ---------------------------------------------
      const apiPayload =
        makeApiPayload(payload);

      console.log(
        "SENDING TO FASTAPI:",
        apiPayload
      );

      try {

        // -------------------------------------------
        // SEND REQUEST
        // -------------------------------------------
        const response =
          await fetch(
            `${API_BASE}/predict`,
            {
              method: "POST",

              headers: {
                "Accept":
                  "application/json",

                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(
                  apiPayload
                )
            }
          );

        console.log(
          "API STATUS:",
          response.status
        );

        // -------------------------------------------
        // READ RESPONSE
        // -------------------------------------------
        const data =
          await response.json()
            .catch(() => null);

        console.log(
          "API RESPONSE:",
          data
        );

        // -------------------------------------------
        // 422 VALIDATION ERROR
        // -------------------------------------------
        if (
          response.status === 422
        ) {

          const matched =
            data &&
            applyServerValidationErrors(
              data.detail
            );

          renderError(
            "Check your inputs",
            matched
              ? "The API rejected some fields. Please check the highlighted fields."
              : "The API rejected your input."
          );

          return;
        }

        // -------------------------------------------
        // OTHER SERVER ERROR
        // -------------------------------------------
        if (!response.ok) {

          const message =
            data &&
            typeof data.detail ===
              "string"
              ? data.detail
              : `API returned status ${response.status}.`;

          renderError(
            "Prediction failed",
            message
          );

          return;
        }

        // -------------------------------------------
        // SUCCESS
        // -------------------------------------------
        console.log(
          "SUCCESS RESPONSE:",
          data
        );

        /*
          Expected FastAPI response:

          {
            "predicted_mental_health_score": 6.06
          }
        */

        if (
          !data ||
          data.predicted_mental_health_score ===
            undefined ||
          data.predicted_mental_health_score ===
            null
        ) {

          renderError(
            "Prediction missing",
            "The server responded successfully, but no prediction score was returned."
          );

          return;
        }

        // Convert prediction to number.
        const prediction =
          Number(
            data.predicted_mental_health_score
          );

        console.log(
          "PREDICTION RECEIVED:",
          prediction
        );

        if (
          !Number.isFinite(
            prediction
          )
        ) {

          renderError(
            "Invalid prediction",
            `The server returned: ${data.predicted_mental_health_score}`
          );

          return;
        }

        // -------------------------------------------
        // SHOW FINAL RESULT
        // -------------------------------------------
        renderResult(
          prediction
        );

      } catch (error) {

        console.error(
          "FETCH ERROR:",
          error
        );

        renderError(
          "Can't reach the server",
          `Couldn't connect to ${API_BASE}. Make sure you are running: python -m uvicorn main:app --reload`
        );

      } finally {

        setSubmitting(false);
      }
    }
  );

  // =========================================================
  // CLEAR FIELD ERRORS WHEN USER EDITS
  // =========================================================
  form
    .querySelectorAll(
      "input, select"
    )
    .forEach((element) => {

      element.addEventListener(
        "input",
        () =>
          clearFieldError(
            element
          )
      );

      element.addEventListener(
        "change",
        () =>
          clearFieldError(
            element
          )
      );
    });

  // =========================================================
  // RESET / RUN ANOTHER READ
  // =========================================================
  if (resetBtn) {

    resetBtn.addEventListener(
      "click",
      () => {

        showState("idle");

        if (segGroup) {

          segGroup
            .querySelectorAll(
              ".seg-btn"
            )
            .forEach(
              (button) => {
                button.classList.remove(
                  "active"
                );
              }
            );
        }

        if (stressHiddenInput) {
          stressHiddenInput.value =
            "";
        }

        clearAllErrors();
      }
    );
  }

  // =========================================================
  // RETRY AFTER ERROR
  // =========================================================
  if (errorRetryBtn) {

    errorRetryBtn.addEventListener(
      "click",
      () => {

        showState("idle");

        clearAllErrors();
      }
    );
  }

})();