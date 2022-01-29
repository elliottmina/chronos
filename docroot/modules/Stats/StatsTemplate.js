var StatsTemplate = `
<section class="pie" id="StatsEfficiency">
  <h2>Efficiency</h2>
  <canvas id="StatsEfficiencyChart" height="50" width="50"></canvas>
</section>
<section class="pie" id="StatsTodayRoot">
  <h2>Daily distribution</h2>
  <div class="content">
    <canvas-wrapper>
      <canvas id="StatsTodayRootChart" height="50" width="50"></canvas>
    </canvas-wrapper>
    <ul class="legend"></ul>
  </div>
</section>
<section class="pie" id="StatsWeeklyRoot">
  <h2>Weekly distribution</h2>
  <div class="content">
    <canvas-wrapper>
      <canvas id="StatsWeeklyRootChart" height="50" width="50"></canvas>
    </canvas-wrapper>
    <ul class="legend"></ul>
  </div>
</section>
`;