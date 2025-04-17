import { SvgIcon } from '../type'

export default function SunIcon(props: SvgIcon) {
  const { width = 18, height = 18 } = props

  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" className="chakra-icon" {...props}>
      <path
        d="M2.25 8.25C2.10166 8.25 1.95666 8.29399 1.83332 8.3764C1.70999 8.45881 1.61386 8.57594 1.55709 8.71299C1.50032 8.85003 1.48547 9.00083 1.51441 9.14632C1.54335 9.2918 1.61478 9.42544 1.71967 9.53033C1.82456 9.63522 1.9582 9.70665 2.10368 9.73559C2.24917 9.76453 2.39997 9.74968 2.53701 9.69291C2.67406 9.63614 2.79119 9.54002 2.8736 9.41668C2.95601 9.29334 3 9.14834 3 9C3 8.80109 2.92098 8.61032 2.78033 8.46967C2.63968 8.32902 2.44891 8.25 2.25 8.25ZM3.6975 13.245C3.59216 13.3497 3.52029 13.4833 3.49099 13.6289C3.46169 13.7746 3.47628 13.9256 3.53291 14.0629C3.58955 14.2002 3.68568 14.3176 3.80911 14.4002C3.93254 14.4828 4.07772 14.5269 4.22625 14.5269C4.37478 14.5269 4.51996 14.4828 4.64339 14.4002C4.76683 14.3176 4.86295 14.2002 4.91959 14.0629C4.97622 13.9256 4.99081 13.7746 4.96151 13.6289C4.93221 13.4833 4.86034 13.3497 4.755 13.245C4.61448 13.1053 4.42439 13.0269 4.22625 13.0269C4.02811 13.0269 3.83802 13.1053 3.6975 13.245ZM4.755 4.755C4.86034 4.65029 4.93221 4.51666 4.96151 4.37105C4.99081 4.22545 4.97622 4.07442 4.91959 3.93711C4.86295 3.79981 4.76683 3.68241 4.64339 3.5998C4.51996 3.51719 4.37478 3.47309 4.22625 3.47309C4.07772 3.47309 3.93254 3.51719 3.80911 3.5998C3.68568 3.68241 3.58955 3.79981 3.53291 3.93711C3.47628 4.07442 3.46169 4.22545 3.49099 4.37105C3.52029 4.51666 3.59216 4.65029 3.6975 4.755C3.83802 4.89469 4.02811 4.97309 4.22625 4.97309C4.42439 4.97309 4.61448 4.89469 4.755 4.755ZM9 3C9.14834 3 9.29334 2.95601 9.41668 2.8736C9.54002 2.79119 9.63614 2.67406 9.69291 2.53701C9.74968 2.39997 9.76453 2.24917 9.73559 2.10368C9.70665 1.9582 9.63522 1.82456 9.53033 1.71967C9.42544 1.61478 9.2918 1.54335 9.14632 1.51441C9.00083 1.48547 8.85003 1.50032 8.71299 1.55709C8.57594 1.61386 8.45881 1.70999 8.3764 1.83332C8.29399 1.95666 8.25 2.10166 8.25 2.25C8.25 2.44891 8.32902 2.63968 8.46967 2.78033C8.61032 2.92098 8.80109 3 9 3ZM13.245 13.245C13.1397 13.3497 13.0678 13.4833 13.0385 13.6289C13.0092 13.7746 13.0238 13.9256 13.0804 14.0629C13.137 14.2002 13.2332 14.3176 13.3566 14.4002C13.48 14.4828 13.6252 14.5269 13.7738 14.5269C13.9223 14.5269 14.0675 14.4828 14.1909 14.4002C14.3143 14.3176 14.4105 14.2002 14.4671 14.0629C14.5237 13.9256 14.5383 13.7746 14.509 13.6289C14.4797 13.4833 14.4078 13.3497 14.3025 13.245C14.162 13.1053 13.9719 13.0269 13.7738 13.0269C13.5756 13.0269 13.3855 13.1053 13.245 13.245ZM15.75 8.25C15.6017 8.25 15.4567 8.29399 15.3333 8.3764C15.21 8.45881 15.1139 8.57594 15.0571 8.71299C15.0003 8.85003 14.9855 9.00083 15.0144 9.14632C15.0434 9.2918 15.1148 9.42544 15.2197 9.53033C15.3246 9.63522 15.4582 9.70665 15.6037 9.73559C15.7492 9.76453 15.9 9.74968 16.037 9.69291C16.1741 9.63614 16.2912 9.54002 16.3736 9.41668C16.456 9.29334 16.5 9.14834 16.5 9C16.5 8.80109 16.421 8.61032 16.2803 8.46967C16.1397 8.32902 15.9489 8.25 15.75 8.25ZM13.245 3.6975C13.1397 3.80221 13.0678 3.93584 13.0385 4.08145C13.0092 4.22705 13.0238 4.37808 13.0804 4.51539C13.137 4.65269 13.2332 4.77009 13.3566 4.8527C13.48 4.93531 13.6252 4.97941 13.7738 4.97941C13.9223 4.97941 14.0675 4.93531 14.1909 4.8527C14.3143 4.77009 14.4105 4.65269 14.4671 4.51539C14.5237 4.37808 14.5383 4.22705 14.509 4.08145C14.4797 3.93584 14.4078 3.80221 14.3025 3.6975C14.162 3.55781 13.9719 3.47941 13.7738 3.47941C13.5756 3.47941 13.3855 3.55781 13.245 3.6975ZM9 15C8.85166 15 8.70666 15.044 8.58332 15.1264C8.45999 15.2088 8.36386 15.3259 8.30709 15.463C8.25033 15.6 8.23547 15.7508 8.26441 15.8963C8.29335 16.0418 8.36478 16.1754 8.46967 16.2803C8.57456 16.3852 8.7082 16.4566 8.85368 16.4856C8.99917 16.5145 9.14997 16.4997 9.28701 16.4429C9.42406 16.3861 9.54119 16.29 9.6236 16.1667C9.70601 16.0433 9.75 15.8983 9.75 15.75C9.75 15.5511 9.67098 15.3603 9.53033 15.2197C9.38968 15.079 9.19891 15 9 15ZM9 4.5C8.10998 4.5 7.23996 4.76392 6.49993 5.25839C5.75991 5.75285 5.18314 6.45566 4.84254 7.27793C4.50195 8.10019 4.41283 9.00499 4.58647 9.87791C4.7601 10.7508 5.18868 11.5526 5.81802 12.182C6.44736 12.8113 7.24918 13.2399 8.12209 13.4135C8.99501 13.5872 9.89981 13.4981 10.7221 13.1575C11.5443 12.8169 12.2471 12.2401 12.7416 11.5001C13.2361 10.76 13.5 9.89002 13.5 9C13.5 7.80653 13.0259 6.66193 12.182 5.81802C11.3381 4.97411 10.1935 4.5 9 4.5ZM9 12C8.40666 12 7.82664 11.8241 7.33329 11.4944C6.83994 11.1648 6.45542 10.6962 6.22836 10.1481C6.0013 9.59987 5.94189 8.99667 6.05764 8.41473C6.1734 7.83279 6.45912 7.29824 6.87868 6.87868C7.29824 6.45912 7.83279 6.1734 8.41473 6.05764C8.99667 5.94189 9.59987 6.0013 10.1481 6.22836C10.6962 6.45542 11.1648 6.83994 11.4944 7.33329C11.8241 7.82664 12 8.40666 12 9C12 9.79565 11.6839 10.5587 11.1213 11.1213C10.5587 11.6839 9.79565 12 9 12Z"
        fill="currentColor"
      />
    </svg>
  )
}
