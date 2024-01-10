WORKING_DIR=$(pwd)
OUTPUT_DIR="${WORKING_DIR}/build/"
cd neustar-order-insights-ui-prod
npm install --non-interactive
npm run lint:fix
npm run build:prod
{ echo "# Staticfile"; echo "pushstate: enabled"; echo "force_https: true"; } >> ./artifacts/Staticfile
cp ./manifest.yml ./artifacts
cp -R ./artifacts/. "${OUTPUT_DIR}"
cd "${OUTPUT_DIR}" || exit